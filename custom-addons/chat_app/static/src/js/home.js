/** @odoo-module */

import { Component, useEffect } from "@odoo/owl"
import { registry } from "@web/core/registry"
import { Background, Main } from "./components"

class ChatAppHome extends Component {
    static components = { Background, Main }

    setup() {
        useEffect(
            () => {
                const mainNavbar = document.querySelector(".o_main_navbar")
                mainNavbar.style.display = "none"

                return () => {
                    mainNavbar.style.display = ""
                }
            },
            () => []
        )
    }
}

ChatAppHome.template = "ChatAppHome"

registry.category("actions").add("action_open_chat_app", ChatAppHome)
