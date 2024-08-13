from odoo import models
import copy
from ...models import CONST


class TechnicalInspectionScopeWizXlsx(models.AbstractModel):
    _name = "report.ship_management.ship_technical_inspection_scope"
    _inherit = ["report.report_xlsx.abstract"]

    def generate_xlsx_report(self, workbook, data, record_ids):

        for i, record_id in enumerate(record_ids):
            y = i + 1
            name1 = f"BÁO CÁO  TÌNH TRẠNG KỸ THUẬT {y}"
            sheet = workbook.add_worksheet(name1)
            self.write_sheet(workbook, sheet, record_id)

        workbook.close()

    def write_sheet(self, workbook, sheet, record_id):
        self.create_header(workbook, sheet, record_id)
        self.create_body(workbook, sheet, record_id)
        # self.create_footer(workbook, sheet, record_id)

    def create_body(self, workbook, sheet, record_id, taken_rows=4):
        scopes = record_id.technical_inspection_scope_ids
        format_3 = workbook.add_format(
            self.get_normal_format(border=1, align=False, bold=False)
        )
        format_4 = workbook.add_format(self.get_normal_format(border=1, bold=False))

        prev_task_rows = 0

        for y, scope_id in enumerate(scopes):
            stt = y + 1
            task_ids = scope_id.technical_inspection_task_ids
            task_len = len(task_ids)
            start_row_for_scope = taken_rows + prev_task_rows + 1
            end_row_for_scope = taken_rows + prev_task_rows + task_len

            if task_len == 1:
                sheet.write(f"A{start_row_for_scope}", stt, format_4)
                sheet.write(f"B{start_row_for_scope}", scope_id.name, format_3)
            elif task_len > 1:
                scope_stt_row = f"A{start_row_for_scope}:A{end_row_for_scope}"
                scope_name_row = f"B{start_row_for_scope}:B{end_row_for_scope}"
                sheet.merge_range(scope_stt_row, stt, format_4)
                sheet.merge_range(scope_name_row, scope_id.name, format_3)

            for i, task_id in enumerate(task_ids):
                stt = i + 1
                row_number = stt + taken_rows + prev_task_rows
                user_names = ",".join(task_id.user_ids.mapped("name"))

                set_row = taken_rows + prev_task_rows + i
                sheet.set_row(set_row, 40)

                sheet.write(f"C{row_number}", task_id.task_name, format_3)
                sheet.write(f"D{row_number}", task_id.status, format_4)
                sheet.write(f"E{row_number}", task_id.backlog or "", format_3)
                sheet.write(f"F{row_number}", task_id.inspection_date or "", format_3)
                sheet.write(f"G{row_number}", task_id.fix_plan or "", format_3)
                sheet.write(f"H{row_number}", task_id.expected_fix_date or "", format_3)
                sheet.write(f"I{row_number}", task_id.real_fix_date or "", format_3)
                sheet.write(f"J{row_number}", task_id.fix_content or "", format_3)

            prev_task_rows += task_len

    def create_header(self, workbook, sheet, record_id):
        normal_format = workbook.add_format(self.get_normal_format())
        format_2 = workbook.add_format(self.get_normal_format(border=1))

        # set height column
        height = 60
        sheet.set_row(0, height)
        sheet.set_row(3, 40)

        # set width column
        a_width = 5
        b_width = 35
        c_width = 35
        d_width = 20
        e_width = 30
        f_width = 25
        g_width = 35
        h_width = 35
        i_width = 25
        j_width = 35
        sheet.set_column("A:A", a_width)
        sheet.set_column("B:B", b_width)
        sheet.set_column("C:C", c_width)
        sheet.set_column("D:D", d_width)
        sheet.set_column("E:E", e_width)
        sheet.set_column("F:F", f_width)
        sheet.set_column("G:G", g_width)
        sheet.set_column("H:H", h_width)
        sheet.set_column("I:I", i_width)
        sheet.set_column("J:J", j_width)

        name_1 = "BÁO CÁO TỒN ĐỌNG VÀ KHẮC PHỤC"
        sheet.merge_range(f"A1:I1", name_1, format_2)

        name_2 = "Control No: VSICO-\nIssued Date: 01/12/2022\nRevision No: 00\nRevised Date;\nPage:     of "
        sheet.write(f"J1", name_2, format_2)

        name_3 = f"Tên tàu: {record_id.company_id.name}"
        sheet.merge_range(f"A2:B2", name_3, normal_format)

        name_4 = f"Ngày kiểm tra: {record_id.real_date}"
        sheet.merge_range(f"I2:J2", name_4, normal_format)

        # No
        sheet.write(f"A4", "Stt.", format_2)

        # others
        sheet.write(f"B4", "HẠNG MỤC", format_2)
        sheet.write(f"C4", "TÊN THIẾT BỊ, HỆ THỐNG", format_2)
        sheet.write(f"D4", "TÌNH TRẠNG", format_2)
        sheet.write(f"E4", "NỘI DUNG TỒN ĐỌNG", format_2)
        sheet.write(f"F4", "NGÀY KIỂM TRA", format_2)
        sheet.write(f"G4", "KẾ HOẠCH KHẮC PHỤC", format_2)
        sheet.write(f"H4", "NGÀY DỰ KIẾN KHẮC PHỤC", format_2)
        sheet.write(f"I4", "NGÀY KHẮC PHỤC", format_2)
        sheet.write(f"J4", "NỘI DUNG KHẮC PHỤC", format_2)

    def create_footer(self, workbook, sheet, record_id, taken_rows=4):
        normal_format = workbook.add_format(self.get_normal_format(top=1))
        format_2 = workbook.add_format(self.get_normal_format(bold=False))

        scope_ids = record_id.mapped("technical_inspection_scope_ids")
        task_ids = scope_ids.mapped("technical_inspection_task_ids")
        tasks_len = len(task_ids)
        footer_row = taken_rows + tasks_len + 1
        sheet.merge_range(f"A{footer_row}:G{footer_row}", "", normal_format)

        footer_row_2 = footer_row + 1
        sheet.write(f"B{footer_row_2}", "Máy trưởng", format_2)
        sheet.write(f"C{footer_row_2}", "B.P Thuyền viên", format_2)
        sheet.write(f"D{footer_row_2}", "B.P An toàn Pháp chế", format_2)
        sheet.write(f"E{footer_row_2}", "Thuyền trưởng", format_2)
        sheet.write(f"F{footer_row_2}", "B.P Kỹ thuật", format_2)

    def get_normal_format(
        self,
        bold=True,
        align="center",
        font_name="Arial",
        italic=False,
        bg_color=False,
        border=False,
        right=False,
        left=False,
        bottom=False,
        top=False,
    ):
        base_format = {
            "font_name": font_name,
            "font_size": 10,
            "valign": "vcenter",
            "bold": bold,
            "italic": italic,
        }

        if bg_color:
            base_format["bg_color"] = bg_color

        if border:
            base_format["border"] = border

        if right:
            base_format["right"] = right

        if top:
            base_format["top"] = top

        if left:
            base_format["left"] = left

        if bottom:
            base_format["bottom"] = bottom

        if align != False:
            base_format["align"] = align

        return base_format
