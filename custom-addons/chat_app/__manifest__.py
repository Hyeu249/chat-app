{
    "name": "Techno Chat App",
    "author": "Techno THT Gmbh",
    "website": "www.techno-tht.tech",
    "summary": "Techno Chat App",
    "depends": ["mail"],
    "data": [
        "security/ir.model.access.csv",
        "security/role.xml",
        "security/rule.xml",
        "data/sequence.xml",
        "views/menu.xml",
        "views/settings.xml",
        "views/chat.xml",
        "views/message.xml",
        "reports/report.xml",
    ],
    "application": True,
    "assets": {
        "web.assets_backend": [
            "chat_app/static/src/**",
        ],
    },
}
