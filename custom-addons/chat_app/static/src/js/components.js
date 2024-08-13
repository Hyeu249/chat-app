/** @odoo-module */

import { Component, xml, useState, useEffect, onWillStart } from "@odoo/owl"
import { loadCSS } from "@web/core/assets"
import { useService } from "@web/core/utils/hooks"

export class Background extends Component {
    static template = xml`
        <div class="flex-center" style="width: 100%; height: 100%; background-color: #fafafa;">
            <t t-slot="default">default content</t>
        </div>
    `
    static components = {}
}

export class SideBar extends Component {
    static template = xml`
        <div class="flex-column" style="width: 300px; height: 100%; padding: 20px; background-color: #e7f8ff; box-shadow: inset -2px 0 2px 0 rgba(0,0,0,.05)">
            <div class="flex-column-between" style="width: 100%; height: 130px; padding: 20px 0px 10px 0px">
                <div class="flex-between">
                    <div>
                        <div style="font-size: 20px; font-weight: 700;">NextChat</div>
                        <div>Build your own AI assistant</div>
                    </div>
                    <i class="fa fa-apple" aria-hidden="true" style="font-size: 50px; color: black"></i>
                </div>
                <div class="flex-between">
                    <div class="flex-center icon-button shadow-button" style="margin-left: unset; padding: 10px 30px;">
                        <div class="flex-center" style="height: 16px;">
                            <i class="fa fa-diamond" aria-hidden="true"></i><span style="margin-left: 5px;">Mark</span>
                        </div>
                    </div>
                    <div class="flex-center icon-button shadow-button" style="margin-left: unset; padding: 10px 30px;">
                        <div class="flex-center" style="height: 16px;">
                            <i class="fa fa-diamond" aria-hidden="true"></i><span style="margin-left: 5px;">Discovery</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="chat-box scroll" style="flex: 1; width: 100%; padding-top: 10px;">             
                <t t-foreach="props.chats" t-as="chat" t-key="chat.id">
                    <div class="draggable-button shadow-button" t-att-style="props.activeChatId == chat.id ? 'border: 2px solid #1d93ab' : 'border: 2px solid transparent'"
                        t-on-click="()=> props.updateActiveChat(chat.id)"
                    >
                        <div style="font-size: 14px; font-weight: 500"><t t-esc="chat.title"/></div>
                        <div class="flex-between" style="color: #a6a6a6; font-size: 12px;">
                            <div><t t-esc="chat.length"/> messages</div>
                            <div><t t-esc="chat.date"/></div>
                        </div>
                        <div class="flex-center icon-delete" style="width: 19px; height: 19px;" 
                            t-on-click="(event)=> {
                                event.stopPropagation();
                                props.deleteChat(chat.id)
                            }"
                        >
                            <i class="fa fa-trash-o" aria-hidden="true" style="font-size:16px"></i>
                        </div>
                    </div>
                </t>
            </div>

            <div class="flex-between" style="margin-top:20px;">
                <div class="flex-center">
                    <div class="flex-center icon-button shadow-button"
                        t-on-click="props.openSetting"
                    >
                        <div class="flex-center" style="width: 16px; height: 16px;">
                            <i class="fa fa-cogs" aria-hidden="true"></i>
                        </div>
                    </div>
                    <div class="flex-center icon-button shadow-button" style="margin-left: 10px;">
                        <div class="flex-center" style="width: 16px; height: 16px;">
                            <i class="fa fa-diamond" aria-hidden="true"></i>
                        </div>
                    </div>
                </div>

                <div class="flex-center icon-button shadow-button" t-on-click="props.createNewChat">
                    <div class="flex-center" style="height: 16px;">
                        <i class="fa fa-plus" aria-hidden="true"></i> <span style="margin-left: 5px; font-weight: 450">New Chat</span>
                    </div>
                </div>
            </div>
        </div>
    `
    static components = {}

    setup() {
        onWillStart(async () => {
            await loadCSS("/chat_app/static/src/css/chat_box.css")
        })
        useEffect(
            () => {
                let isDragging = false
                let currentItem = null
                let containerOffsetY = 0
                let initY = 0
                let mouseDownTimer

                const container = document.querySelector(".chat-box")
                container.style.width = container.offsetWidth + "px"
                container.style.height = container.offsetHeight + "px"

                const onMouseDown = (e) => {
                    const item = e.target.closest(".draggable-button")
                    if (item) {
                        mouseDownTimer = setTimeout(() => {
                            isDragging = true
                            currentItem = item
                            containerOffsetY = currentItem.offsetTop
                            currentItem.classList.add("dragging")
                            document.body.style.userSelect = "none"
                            currentItem.classList.add("insert-animation")
                            currentItem.style.top = containerOffsetY + "px"
                            initY = e.clientY
                        }, 200)
                    }
                }

                const onMouseMove = (e) => {
                    if (isDragging && currentItem) {
                        currentItem.classList.remove("insert-animation")
                        let newTop = containerOffsetY - (initY - e.clientY)
                        if (newTop < -50) {
                            newTop = -50
                        } else if (newTop > container.offsetHeight - 30) {
                            newTop = container.offsetHeight - 30
                        }
                        currentItem.style.top = newTop + "px"

                        let itemSibilings = [...document.querySelectorAll(".draggable-button:not(.dragging)")]
                        let nextItem = itemSibilings.find((sibiling) => {
                            return (
                                e.clientY - container.getBoundingClientRect().top <=
                                sibiling.offsetTop + sibiling.offsetHeight / 2
                            )
                        })

                        itemSibilings.forEach((sibiling) => {
                            sibiling.style.marginTop = "10px"
                        })

                        if (nextItem) {
                            nextItem.style.marginTop = currentItem.offsetHeight + 20 + "px"
                        }
                        container.insertBefore(currentItem, nextItem)
                    }
                }

                const onMouseUp = () => {
                    if (currentItem) {
                        currentItem.classList.remove("dragging")
                        currentItem.style.top = "auto"
                        currentItem = null
                        isDragging = false

                        document.body.style.userSelect = "auto"

                        let itemSibilings = [...document.querySelectorAll(".draggable-button:not(.dragging)")]

                        itemSibilings.forEach((sibiling) => {
                            sibiling.style.marginTop = "10px"
                        })
                    }
                    clearTimeout(mouseDownTimer)
                }

                document.addEventListener("mousedown", onMouseDown)
                document.addEventListener("mousemove", onMouseMove)
                document.addEventListener("mouseup", onMouseUp)

                return () => {
                    document.removeEventListener("mousedown", onMouseDown)
                    document.removeEventListener("mousemove", onMouseMove)
                    document.removeEventListener("mouseup", onMouseUp)
                }
            },
            () => []
        )
    }
}

export class Content extends Component {
    static template = xml`
        <div class="flex-column" style="height: 100%; justify-content: space-between;">
            <div class="flex-between" style="height: 75px; padding: 0px 20px; border-bottom: 1px solid rgba(0,0,0,.1)">
                <div>
                    <div style="font-size: 20px; font-weight: bolder; cursor: pointer;"><t t-esc="props.activeChat.title"/></div>
                    <div><t t-esc="props.activeChat.length"/> messages</div>
                </div>
                <div class="flex-center">
                    <div class="flex-center icon-button">
                        <div class="flex-center" style="width: 16px; height: 16px;">
                            <i class="fa fa-pencil" aria-hidden="true"></i>
                        </div>
                    </div>
                    <div class="flex-center icon-button" style="margin-left: 10px;">
                        <div class="flex-center" style="width: 16px; height: 16px;">
                            <i class="fa fa-reply-all" aria-hidden="true"></i>
                        </div>
                    </div>
                    <div class="flex-center icon-button" style="margin-left: 10px;" t-on-click="props.toggleView">
                        <div class="flex-center" style="width: 16px; height: 16px;">
                            <i t-att-class="props.isToggle ? 'fa fa-toggle-on' : 'fa fa-toggle-off' "></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="scroll">Content</div>

            <div style="padding: 10px 20px 20px 20px; border-top: 1px solid rgba(0,0,0,.1)">
                <div class="flex" style="margin-bottom: 10px">
                    <div class="flex-center" style="padding: 10px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 10px; margin-right: 5px">
                        <i class="fa fa-cog"></i>
                    </div>
                    <div class="flex-center" style="padding: 10px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 10px; margin-right: 5px">
                        <i class="fa fa-commenting"></i>
                    </div>
                    <div class="flex-center" style="padding: 10px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 10px;">
                        <i class="fa fa-code"></i>
                    </div>
                </div>

                <div style="position: relative">
                    <textarea placeholder="Enter to send, Shift + Enter to wrap, / to search prompts, : to use commands" rows="3" 
                        spellcheck="false" class="textarea-chat">
                    </textarea>
                    <div class="flex-center send-button" t-on-click="props.createNewMessage">
                        <div class="flex-center" style="height: 16px;">
                            <i class="fa fa-paper-plane" aria-hidden="true"></i> <span style="margin-left: 5px; font-weight: 450">Send</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
    static components = {}
}

export class SettingContent extends Component {
    static template = xml`
        <div>
            <div class="flex-between" style="height: 75px; padding: 0px 20px; border-bottom: 1px solid rgba(0,0,0,.1)">
                <div>
                    <div style="font-size: 20px; font-weight: bolder; cursor: pointer;">Settings</div>
                    <div>All Settings</div>
                </div>
                <div class="flex-center icon-button" t-on-click="props.closeSetting">
                    <div class="flex-center" style="width: 16px; height: 16px;">
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
            <div>Content</div>
        </div>
    `
    static components = {}
}

export class Main extends Component {
    static components = { SideBar, Content, SettingContent }

    static template = xml`
        <div class="main-chat-app" t-att-style="state.isToggle ? 'width: 100%; height: 100%; border: none' : 'width: 1200px; height: 90%; border-radius: 20px;' ">
            <SideBar chats="state.chats" 
                activeChatId="state.activeChat.id" 
                openSetting.bind="openSetting" 
                updateActiveChat.bind="updateActiveChat"
                createNewChat.bind="createNewChat"
                deleteChat.bind="deleteChat"
            />
            <div  style="flex: 1; background-color:white">
                <Content activeChat="state.activeChat" isToggle="state.isToggle" toggleView.bind="toggleView" createNewMessage.bind="createNewMessage" t-if="state.isSetting == false"/>
                <SettingContent closeSetting.bind="closeSetting" t-if="state.isSetting == true"/>
            </div>
        </div>
    `

    setup() {
        this.orm = useService("orm")
        this.state = useState({
            activeChat: { id: 0, title: "Weltklasse", date: "", length: 0 },
            chats: [],
            isToggle: false,
            isSetting: false,
        })

        useEffect(
            () => {
                this.getChats()
                return () => {}
            },
            () => []
        )
    }

    async getChats() {
        const chats = await this.orm.call("chat.app.chat", "get_chats_based_on_user", [""], {})
        this.state.chats = chats
    }

    async createNewChat() {
        const chat_id = await this.orm.call("chat.app.chat", "create_new_chat", [""], {})
        await this.getChats()
        this.updateActiveChat(chat_id)
    }

    async deleteChat(chat_id) {
        await this.orm.call("chat.app.chat", "delete_chat", [chat_id], {})
        this.getChats()
    }

    async createNewMessage() {
        console.log("create message")
    }

    toggleView() {
        this.state.isToggle = !this.state.isToggle
    }

    openSetting() {
        this.state.isSetting = true
    }

    closeSetting() {
        this.state.isSetting = false
    }

    updateActiveChat(id) {
        if (id == this.state.activeChat.id) return
        const chat = this.state.chats.filter((e) => e.id == id)

        if (chat.length) {
            this.state.activeChat = chat[0]
        }
    }
}
