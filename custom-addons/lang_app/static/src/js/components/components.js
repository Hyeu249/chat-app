/** @odoo-module */

import { Component, useState, onMounted, useRef, xml, useEffect } from "@odoo/owl"

import { Vocabulary } from "./Vocabulary"

export class Header extends Component {
    static template = xml`
        <div style="height: 50px; background-color: orange;">
            Header
        </div>
    `
    static components = {}
}

export class Sidebar extends Component {
    sidebar = useRef("sidebar")
    static template = xml`
        <div t-ref="sidebar" class="sidebar">
            <button class="sidebar-button" t-on-click="()=> props.updateIsVocabulary(false)">Trang chủ</button>
            <button class="sidebar-button" t-on-click="()=> props.updateIsVocabulary(true)">Từ vựng</button>
            <button class="sidebar-button" t-on-click="openProfile">Video</button>
        </div>
    `

    setup() {
        useEffect(
            () => {
                this.appendStyle()
            },
            () => []
        )
    }

    appendStyle() {
        var style = document.createElement("style")
        var css = this.getCss()
        style.appendChild(document.createTextNode(css))

        this.sidebar.el.appendChild(style)
    }

    openProfile() {
        alert("Profile button clicked!")
    }

    getCss() {
        return `
        .sidebar {
            width: 250px;
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
        }

        .sidebar-button {
            background-color: #ffffff;
            width: 180px;
            color: #4CAF50;
            border: none;
            padding: 10px 20px;
            margin: 10px;
            cursor: pointer;
            border-radius: 5px;
            font-size: 19px;
            font-weight: 400;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            transition: background-color 0.3s, box-shadow 0.3s;
        }

        .sidebar-button:hover {
            background-color: #e8e8e8;
        }

        .sidebar-button:active {
            background-color: #d0d0d0;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
    `
    }
}

export class HomeContent extends Component {
    homeContent = useRef("homeContent")
    static template = xml`
        <div t-ref="homeContent" class="content">
            <div class="header">
                <div class="course-title">Tiếng Anh (Anh Quốc) - Cấp độ</div>
                <div class="level">1</div>
            </div>

            <div class="progress-bar">
                <div class="progress-bar-inner"></div>
            </div>

            <div class="score-section">
                <div class="title">Điểm của tôi</div>
                <div class="score">0 đ</div>
            </div>

            <div class="container score-category">
                <div style="" t-on-click="(e)=> this.changeBackgroundColorAndMoveSlide(e, 3)">
                    <div class="category-title">Học từ mới</div>
                    <div class="category-score" style="">0 đ</div>
                    <div style="">Các từ đã thành thạo</div>
                    <div>Đã bắt đầu học</div>
                </div>
                <div style="background-color: rgb(223, 230, 233);" t-on-click="(e)=> this.changeBackgroundColorAndMoveSlide(e, 1)">
                    <div class="category-title">Nghe các từ đã học</div>
                    <div class="category-score" style="">0 đ</div>
                    <div style="">Video mới đã xem</div>
                    <div>Đã xem lại</div>
                </div>
                <div style="" t-on-click="(e)=> this.changeBackgroundColorAndMoveSlide(e, 2)">
                    <div class="category-title">Dùng các từ đã học</div>
                    <div class="category-score" style="">0 đ</div>
                    <div style="">Đối thoại đã hoàn thành</div>
                    <div>Đã xem lại</div>
                </div>
            </div>
        </div>

        <div class="carousel">
            <div class="carousel-images" style="transform: translateX(-200%);">
                <div style="background: red;">hello1</div>
                <div style="background: green;">hello2</div>
                <div style="background: blue;">hello3</div>
            </div>
            <button class="prev" t-on-click="(e)=> this.moveSlide(-1)">❮</button>
            <button class="next" t-on-click="(e)=> this.moveSlide(1)">❯</button>
        </div>
    `

    currentSlide = 0
    slideInterval = 3000
    slideTimer

    setup() {
        useEffect(
            () => {
                this.appendStyle()

                this.showSlide(this.currentSlide)
                this.slideTimer = setInterval(() => {
                    this.moveSlide(1)
                }, this.slideInterval)

                return () => clearInterval(this.slideTimer)
            },
            () => []
        )
    }

    showSlide(index) {
        const slides = document.querySelectorAll(".carousel-images div")
        if (index >= slides.length) {
            this.currentSlide = 0
        } else if (index < 0) {
            this.currentSlide = slides.length - 1
        } else {
            this.currentSlide = index
        }
        const offset = -this.currentSlide * 100
        document.querySelector(".carousel-images").style.transform = `translateX(${offset}%)`
    }

    moveSlide(step, slideIndex) {
        if (slideIndex) {
            this.showSlide(slideIndex)
        } else {
            this.showSlide(this.currentSlide + step)
        }
        this.resetSlideTimer()
    }

    resetSlideTimer() {
        clearInterval(this.slideTimer)
        this.slideTimer = setInterval(() => {
            this.moveSlide(1)
        }, this.slideInterval)
    }

    handleCategoryClick(event) {
        // Remove background color from all categories
        document.querySelectorAll(".score-category div").forEach((div) => {
            div.style.backgroundColor = ""
        })

        // Set background color for the clicked category
        event.currentTarget.style.backgroundColor = "#dfe6e9" // Change color as desired
    }

    changeBackgroundColorAndMoveSlide(event, slideIndex) {
        this.handleCategoryClick(event)
        this.moveSlide(false, slideIndex)
    }

    appendStyle() {
        var style = document.createElement("style")
        var css = this.getCss()
        style.appendChild(document.createTextNode(css))

        this.homeContent.el.appendChild(style)
    }

    getCss() {
        return `
        .content {
            flex: 1;
            align-items: center;
            padding: 20px;
            background-color: white;
        }

        .carousel {
            position: fixed;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            max-width: 600px;
            background-color: white;
            box-shadow: rgba(0, 0, 0, 0.25) 0px 0.125rem 0.25rem 0px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            z-index: 1000;
        }

        .carousel-images {
            display: flex;
            transition: transform 0.5s ease;
            width: calc(3 * 100%);
        }

        .carousel-images div {
            width: 100%;
            height: 120px;
            flex: 0 0 auto;
        }

        .carousel button {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            padding: 10px;
            cursor: pointer;
            z-index: 1;
        }

        .prev {
            left: 10px;
        }

        .next {
            right: 10px;
        }

        /* Additional styles for the content area */
        .container {
            background-color: white;
            border-radius: 8px;
            box-shadow: rgba(0, 0, 0, 0.25) 0px 0.125rem 0.25rem 0px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header .level {
            background-color: #ffcc00;
            color: #000;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }

        .progress-bar {
            margin: 20px 0;
            height: 10px;
            background-color: #f1f1f1;
            border-radius: 5px;
            overflow: hidden;
        }

        .progress-bar-inner {
            width: 50%;
            background-color: #4CAF50;
            height: 100%;
        }

        .score-section {
            background-color: #ffeb99;
            padding: 10px;
            border-radius: 5px;
        }

        .score-section .title {
            font-weight: bold;
            margin-bottom: 10px;
        }

        .score-section .score {
            font-size: 24px;
            font-weight: bold;
            text-align: right;
        }

        .score-category {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            cursor: pointer; /* Add cursor to indicate clickable items */
        }

        .score-category div {
            text-align: center;
            flex: 1;
            padding: 10px;
            transition: background-color 0.3s; /* Smooth transition */
        }

        .score-category div:not(:last-child) {
            border-right: 1px solid #ccc;
        }

        .score-category .category-title {
            font-weight: bold;
        }

        .score-category .category-score {
            font-size: 24px;
            font-weight: bold;
        }
    `
    }
}

export class Body extends Component {
    static template = xml`
        <div style="flex: 1; background-color: red;">
            <div class="font-monospace pt8 bg-light" style="height: 100vh; display: flex;">
                <Sidebar updateIsVocabulary.bind="updateIsVocabulary"/>
                <HomeContent t-if="!state.isVocabulary"/>
                <Vocabulary t-if="state.isVocabulary"/>
            </div>  
        </div>
    `
    static components = { Sidebar, HomeContent, Vocabulary }

    setup() {
        this.state = useState({ isVocabulary: false })
    }

    updateIsVocabulary(value = false) {
        this.state.isVocabulary = value
    }
}
