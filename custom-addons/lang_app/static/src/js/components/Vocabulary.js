/** @odoo-module */

import { Component, useState, onMounted, useRef, xml, useEffect, onWillStart } from "@odoo/owl"
import { useService } from "@web/core/utils/hooks"
import { randomImage } from "./images"

export class LearningItem extends Component {
    learningItem = useRef("LearningItem")
    static template = xml`
        <div t-ref="LearningItem" class="learning-item" style="props.background" t-on-click="openLearning">
            <t t-esc="props.learning.name"/>
        </div>
    `

    setup() {
        this.res_id = this.props.learning.id
        this.model_name = "lang.app.learning"
        this.orm = useService("orm")
        this.action = useService("action")

        onMounted(() => this.setBackground())
    }

    async openLearning() {
        const action = await this.orm.call(this.model_name, "open_learning", [this.res_id], {})
        this.action.doAction(action)
    }

    setBackground() {
        this.learningItem.el.style.setProperty("--background-image-url", `url(${randomImage()})`)
    }
}

export class Learning extends Component {
    static components = { LearningItem }
    static template = xml`
        <div class="scrollable-list">
            <t t-foreach="state.learningList" t-as="learning" t-key="learning.id">
                <LearningItem learning="learning"/>
            </t>
        </div>
    `
    setup() {
        this.model_name = "lang.app.learning"
        this.orm = useService("orm")
        this.state = useState({ byTopicId: false, byLearningIds: false, learningList: [] })

        onWillStart(async () => {
            if (this.props.byTopicId) this.getLearningsByTopicId()
            if (this.props.byLearningIds) this.getLearningsByIds()
        })
    }

    async getLearningsByTopicId() {
        this.state.learningList = await this.orm.searchRead(
            this.model_name,
            [["topic_id", "=", this.props.topic_id]],
            ["id", "name", "description"]
        )
    }
    async getLearningsByIds() {
        this.state.learningList = await this.orm.searchRead(
            this.model_name,
            [["id", "in", this.props.learning_ids]],
            ["id", "name", "description"]
        )
    }
}

export class TopicTable extends Component {
    static components = { Learning }
    static template = xml`
        <div style="margin-top: 15px">
            <div t-esc="props.topic.name" style="font-size: 22px; font-weight: 700;"/>
            <Learning byTopicId="true" topic_id="props.topic.id"/>
        </div>
    `
}

export class StartedLearnings extends Component {
    static components = { Learning }
    static template = xml`
        <div style="margin-top: 15px">
            <div style="font-size: 22px; font-weight: 700;">Các bài đã học</div>
            <Learning byLearningIds="true" learning_ids="state.learningList"/>
        </div>
    `
    setup() {
        this.model_name = "lang.app.learning"
        this.orm = useService("orm")
        this.state = useState({ learningList: [] })

        onWillStart(async () => this.getStartedLearnings())
    }

    async getStartedLearnings() {
        const learning_ids = await this.orm.call(this.model_name, "get_started_learnings", [""], {})
        this.state.learningList = learning_ids
    }
}

const svg = `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
<path d="M12 21a8.645 8.645 0 0 0 3.476-.705 9.174 9.174 0 0 0 2.865-1.944 9.097 9.097 0 0 0 1.954-2.866c.47-1.09.705-2.251.705-3.485a8.523 8.523 0 0 0-.714-3.467 9.067 9.067 0 0 0-1.954-2.874 9.098 9.098 0 0 0-2.865-1.954A8.644 8.644 0 0 0 11.99 3a8.62 8.62 0 0 0-3.467.705 9.21 9.21 0 0 0-4.82 4.828A8.62 8.62 0 0 0 3 12c0 1.234.235 2.396.705 3.485a9.31 9.31 0 0 0 1.954 2.866 9.174 9.174 0 0 0 2.865 1.944A8.645 8.645 0 0 0 12 21Zm-2.659-4.284c-.162.12-.32.166-.47.141a.486.486 0 0 1-.338-.244c-.075-.132-.081-.298-.018-.498l1.042-3.12L6.88 11.09c-.157-.113-.244-.248-.263-.404a.52.52 0 0 1 .122-.414c.107-.119.263-.175.47-.169l3.279.01 1.005-3.138c.056-.182.153-.304.29-.366a.478.478 0 0 1 .414 0c.138.062.235.184.292.366l1.005 3.138 3.288-.01c.213-.006.366.05.46.17.1.118.138.256.113.413a.557.557 0 0 1-.254.394l-2.677 1.917 1.043 3.119c.069.2.065.366-.01.498a.491.491 0 0 1-.347.244c-.15.025-.307-.022-.47-.14l-2.65-1.936-2.649 1.935Z" fill="currentcolor"></path>
</svg>
`

export class UpdateToPro extends Component {
    vocabulary = useRef("Vocabulary")
    static template = xml`
        <div class="flex" style="justify-content: space-between; align-items: center; background-color: #fff8e5; padding: 16px; border-radius: 10px; font-size: 18px">
            <div class="flex" style="align-items: center">
                ${svg}
                <div style="margin-left: 10px">60% off Memrise Lifetime - Limited time offer!</div>
            </div>
            <div class="flex" style="align-items: center">
                <div>₫1,999,600   <span style="font-weight: 600">₫4,999,000</span></div>
                <div style="margin-left:20px; padding:5px; border: 1px solid black; border-radius: 10px; font-weight: 600; background-color:white">Upgrade to Pro</div>
            </div>
        </div>
    `
}

export class ToggleButton extends Component {
    static template = xml`
        <div class="flex" style="padding: 4px; background-color: #efefef; font-weight: 600; border-radius: 8px; font-size: 18px; margin-top: 15px; cursor: pointer; user-select: none">
            <div t-att-class="state.isToggle ? 'toggle-border' : '' " style="padding: 5px 0px; width: 250px; text-align: center"
            t-on-click="toggleTrue"
            >Learn</div>
            <div t-att-class="!state.isToggle ? 'toggle-border' : '' " style="padding: 5px 0px; width: 250px; text-align: center"
            t-on-click="toggleFalse"
            >Review</div>
        </div>
    `

    setup() {
        this.state = useState({
            isToggle: true,
        })
    }

    toggleTrue() {
        this.state.isToggle = true
    }

    toggleFalse() {
        this.state.isToggle = false
    }
}

export class SearchBar extends Component {
    static components = { ToggleButton }
    static template = xml`
        <div class="flex" style="justify-content: space-between">
            <ToggleButton/>
            <div class="flex" style="font-size: 16px; align-items: center">
                <div><input style="width: 20px; height: 20px" type="checkbox"/><span style="margin-left: 15px">Show only free scenarios</span></div>
                <input style="width: 150px; height: 30px; border-radius: 8px; border: 1px solid #d9dee8; margin-left: 15px; outline:none"/>
            </div>
        </div>
    `
}

export class Vocabulary extends Component {
    vocabulary = useRef("Vocabulary")
    static components = { TopicTable, UpdateToPro, SearchBar, StartedLearnings }
    static template = xml`
        <div t-ref="Vocabulary" class="flex-column" style="flex: 1; padding:25px; overflow-y: auto; margin-bottom:100px">
            <UpdateToPro/>
            <SearchBar/>
            <StartedLearnings/>
            <t t-foreach="state.topicList" t-as="topic" t-key="topic.id">
                <TopicTable topic="topic"/>
            </t>
        </div>
    `

    setup() {
        this.model_name = "lang.app.topic"
        this.orm = useService("orm")
        this.state = useState({ topicList: [] })

        onWillStart(async () => this.getAllTopics())
        useEffect(
            () => {
                this.appendStyle()
            },
            () => []
        )
    }

    async getAllTopics() {
        this.state.topicList = await this.orm.searchRead(this.model_name, [], ["id", "name", "learning_ids"])
    }

    appendStyle() {
        var style = document.createElement("style")
        var css = this.getCss()
        style.appendChild(document.createTextNode(css))

        this.vocabulary.el.appendChild(style)
    }

    getCss() {
        return `
        .flex{
            display: flex; 
        }
        .flex-column{
            display: flex; 
            flex-direction: column;
        }

        .scrollable-list {
            display: flex;
            overflow-x: auto;
            scrollbar-width: thin;
            padding: 10px;
        }

        .learning-item {
            position: relative;
            overflow: hidden;
            flex: 0 0 auto;
            min-width: 200px;
            height: 120px;
            background-color: #efefef;
            line-height: 100px;
            border: 1px solid #ddd;
            cursor: pointer;
            user-select: none;
            border-style: solid;
            border-color: rgb(255, 201, 51);
            border-image: initial;
            border-width: 0px 0px 4px;
            border-radius: 8px;
            font-size: 22px;
            color:black;
            text-align: left;
            padding-left: 10px;
            margin-right: 15px;
        }

        .learning-item:hover{
            background-color: #dddddd;
        }

        .learning-item::after {
            content: "";
            position: absolute;
            top: 10px;
            left: 140px;
            width: 100px;
            height: 100px;
            background-image: var(--background-image-url);
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            border-radius: 50%;
            z-index: 0;
            overflow: hidden;
        }

        .toggle-border{
            border: 1px solid rgb(246, 246, 246);
            box-shadow: rgba(0, 0, 0, 0.14) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
            border-radius: 8px;
            background-color: white
        }

    `
    }
}
