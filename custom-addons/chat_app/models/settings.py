# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models, _
from . import CONST
from odoo.exceptions import ValidationError

CONFIG_PARAM_1 = "ship_management.bot_token"
CONFIG_PARAM_2 = "ship_management.is_active_telegram"


class ChatAppSettings(models.TransientModel):
    _inherit = ["res.config.settings"]

    name = fields.Char("Name", config_parameter=CONFIG_PARAM_1)
    description = fields.Char("Description", config_parameter=CONFIG_PARAM_2)

    # relations

    # sequential
    ref = fields.Char(string="Code", default=lambda self: _("New"))
