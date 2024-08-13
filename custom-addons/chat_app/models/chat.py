# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models, _
from . import CONST
from odoo.exceptions import ValidationError
import random


class Chat(models.Model):
    _name = "chat.app.chat"
    _description = "Chat records"
    _inherit = ["mail.thread"]

    title = fields.Char("Title", tracking=True)
    user_id = fields.Many2one(
        "res.users", default=lambda self: self.env.user, tracking=True
    )

    # compute fields
    message_len = fields.Integer(
        "message_len", compute="get_message_len", tracking=True
    )

    # relations
    message_ids = fields.One2many(
        "chat.app.message", "chat_id", string="Message", tracking=True
    )

    @api.depends("message_ids")
    def get_message_len(self):
        for record in self:
            record.message_len = len(record.message_ids)

    @api.model_create_multi
    def create(self, vals_list):
        result = super(Chat, self).create(vals_list)

        for record in result:
            if not record.title:
                record.title = record.get_random_title()

        return result

    def write(self, vals):
        self.ensure_one()
        result = super(Chat, self).write(vals)
        return result

    def create_new_chat(self, title=False):
        new_chat = self.create({"title": title})

        return new_chat.id

    def delete_chat(self):
        self.ensure_one()
        result = self.unlink()
        return result

    def get_random_title(self):
        self.ensure_one()
        chats = self.search([("user_id", "=", self.env.user.id)])
        old_answers = chats.mapped("title")
        new_answers = [item for item in CONST.TITLES if item not in old_answers]

        if new_answers:
            return random.choice(new_answers)
        else:
            return "New Conversation"

    def get_chats_based_on_user(self):
        chat_ids = self.search([("user_id", "=", self.env.user.id)])
        chat_package = [
            {
                "id": chat.id,
                "title": self.cut_text(chat.title),
                "date": chat.create_date,
                "message_len": chat.message_len,
            }
            for chat in chat_ids
        ]

        return chat_package

    def cut_text(self, text, max_length=25):
        if len(text) > max_length:
            return text[:max_length] + "..."
        return text


class Message(models.Model):
    _name = "chat.app.message"
    _description = "Message records"
    _inherit = ["mail.thread"]

    message = fields.Char("Message", tracking=True)
    operation_type = fields.Selection(
        CONST.OPERATION_TYPE,
        string="Operation type",
        required=True,
        default=CONST.USER_MESSAGE_TYPE,
        tracking=True,
    )
    message_type = fields.Selection(
        CONST.MESSAGE_TYPE,
        string="Message type",
        required=True,
        default=CONST.TEXT_TYPE,
        tracking=True,
    )

    # relations
    chat_id = fields.Many2one("chat.app.chat", string="Chat", tracking=True)

    def open_record(self):
        self.ensure_one()
        return {
            "type": "ir.actions.act_window",
            "res_model": self._name,
            "view_mode": "form",
            "res_id": self.id,
            "target": "current",
            "context": self.env.context,
        }
