
```
BACKEND-API
├─ .DS_Store
├─ .blackboxrules
├─ .env
├─ .env.example
├─ docs
│  ├─ .DS_Store
│  ├─ README.md
│  ├─ architecture.md
│  ├─ auth-module-3layer-guide.md
│  ├─ environment-config-guide.md
│  ├─ jest_test_guide.md
│  ├─ nodejs-naming-conventions.md
│  └─ nodemailer_setup_guide.md
├─ package-lock.json
├─ package.json
├─ server.dev.js
├─ server.js
└─ src
   ├─ .DS_Store
   ├─ app.js
   ├─ modules
   │  ├─ .DS_Store
   │  ├─ admin
   │  │  ├─ .DS_Store
   │  │  ├─ controllers
   │  │  │  └─ database.controller.js
   │  │  ├─ models
   │  │  │  └─ settings.model.js
   │  │  └─ routes
   │  │     └─ database.route.js
   │  ├─ auth
   │  │  ├─ .DS_Store
   │  │  ├─ controllers
   │  │  │  ├─ auth.controller.js
   │  │  │  ├─ auth.controller.md
   │  │  │  └─ auth.frontend.controller.js
   │  │  ├─ docs
   │  │  │  ├─ api_documentation.md
   │  │  │  └─ system_design_documentation.md
   │  │  ├─ models
   │  │  │  └─ user.model.js
   │  │  ├─ public
   │  │  │  ├─ .DS_Store
   │  │  │  ├─ README.md
   │  │  │  ├─ assets
   │  │  │  │  └─ logo.png
   │  │  │  ├─ hello
   │  │  │  │  ├─ .DS_Store
   │  │  │  │  ├─ css
   │  │  │  │  │  ├─ bootstrap.css
   │  │  │  │  │  └─ bootstrap.min.css
   │  │  │  │  ├─ index.html
   │  │  │  │  ├─ js
   │  │  │  │  │  └─ scripts.js
   │  │  │  │  └─ scss
   │  │  │  │     ├─ _custom.scss
   │  │  │  │     └─ _variables.scss
   │  │  │  ├─ home.html
   │  │  │  ├─ home.js
   │  │  │  ├─ login-success.html
   │  │  │  ├─ login-success.js
   │  │  │  ├─ login.css
   │  │  │  ├─ login.html
   │  │  │  └─ login.js
   │  │  ├─ repositories
   │  │  │  └─ user.repository.js
   │  │  ├─ routes
   │  │  │  ├─ auth.frontend.route.js
   │  │  │  ├─ auth.route.js
   │  │  │  └─ auth.route.md
   │  │  ├─ services
   │  │  │  ├─ auth.service.js
   │  │  │  └─ auth.service.md
   │  │  ├─ test
   │  │  │  └─ changePassword.test.js
   │  │  ├─ test.js
   │  │  ├─ validators
   │  │  │  ├─ auth.validator.js
   │  │  │  └─ auth.validator.md
   │  │  └─ views
   │  │     ├─ sign-in.ejs
   │  │     └─ sign-up.ejs
   │  ├─ content
   │  │  ├─ .DS_Store
   │  │  ├─ controllers
   │  │  │  └─ content.controller.js
   │  │  ├─ models
   │  │  │  └─ content.model.js
   │  │  ├─ repositories
   │  │  │  └─ content.repository.js
   │  │  ├─ routes
   │  │  │  └─ content.route.js
   │  │  ├─ services
   │  │  │  └─ content.service.js
   │  │  └─ validators
   │  │     └─ content.validator.js
   │  ├─ dashboard
   │  │  ├─ routes
   │  │  │  ├─ dashboard.frontend.route.js
   │  │  │  └─ dashboard.route.js
   │  │  └─ views
   │  │     └─ index.ejs
   │  ├─ file
   │  │  ├─ .DS_Store
   │  │  ├─ controllers
   │  │  │  ├─ file.controller.js
   │  │  │  └─ file.frontend.controller.js
   │  │  ├─ models
   │  │  ├─ repositories
   │  │  │  └─ file.repository.js
   │  │  ├─ routes
   │  │  │  ├─ file.frontend.route.js
   │  │  │  └─ file.route.js
   │  │  ├─ services
   │  │  │  └─ file.service.js
   │  │  └─ views
   │  │     └─ list.ejs
   │  ├─ media
   │  │  ├─ .DS_Store
   │  │  ├─ README.md
   │  │  ├─ configs
   │  │  │  └─ media.table.config.js
   │  │  ├─ controllers
   │  │  │  ├─ media.controller.js
   │  │  │  └─ media.frontend.controller.js
   │  │  ├─ docs
   │  │  │  ├─ Tài liệu Đặc Tả Yêu Cầu Dự Án: Media Manager Tool (Node.js).md
   │  │  │  └─ media_manager_schema_spec.md
   │  │  ├─ models
   │  │  │  ├─ media.model.js
   │  │  │  ├─ post.model.js
   │  │  │  ├─ source_folder.model.js
   │  │  │  ├─ tag.model.js
   │  │  │  └─ user.model.js
   │  │  ├─ repositories
   │  │  │  └─ media.repository.js
   │  │  ├─ routes
   │  │  │  ├─ media.frontend.route.js
   │  │  │  └─ media.route.js
   │  │  ├─ services
   │  │  │  └─ media.service.js
   │  │  ├─ tests
   │  │  │  ├─ .DS_Store
   │  │  │  ├─ media.controller.test.js
   │  │  │  ├─ media.repository.test.js
   │  │  │  ├─ media.route.test.js
   │  │  │  ├─ media.service.test.js
   │  │  │  ├─ test.js
   │  │  │  └─ x.json
   │  │  └─ views
   │  │     ├─ .DS_Store
   │  │     ├─ list.ejs
   │  │     └─ partials
   │  │        ├─ table.ejs
   │  │        ├─ table.footer.ejs
   │  │        └─ table.header.ejs
   │  ├─ notification
   │  │  ├─ .DS_Store
   │  │  ├─ controllers
   │  │  │  └─ notification.controller.js
   │  │  ├─ routes
   │  │  │  └─ notification.route.js
   │  │  └─ services
   │  │     └─ notification.service.js
   │  └─ thirdparty
   │     ├─ .DS_Store
   │     ├─ README.md
   │     ├─ adapters
   │     │  ├─ imgbb.adapter.js
   │     │  ├─ rapidapi.adapter.js
   │     │  ├─ sightengine.adapter.js
   │     │  └─ temp.adapter.js
   │     ├─ controllers
   │     │  ├─ imgbb.controller.js
   │     │  ├─ nsfw.controller.js
   │     │  ├─ rapidapi.controller.js
   │     │  ├─ sightengine.controller.js
   │     │  └─ temp.controller.js
   │     ├─ docs
   │     │  └─ api_documentation.md
   │     ├─ routes
   │     │  ├─ imgbb.route.js
   │     │  ├─ index.js
   │     │  ├─ nsfw.route.js
   │     │  ├─ rapidapi.route.js
   │     │  ├─ sightengine.route.js
   │     │  └─ temp.route.js
   │     └─ validators
   │        ├─ imgbb.validator.js
   │        ├─ rapidapi.validator.js
   │        ├─ sightengine.validator.js
   │        └─ temp.validator.js
   ├─ routes
   │  ├─ backend.route.js
   │  └─ frontend.route.js
   └─ shared
      ├─ .DS_Store
      ├─ adapters
      │  ├─ .DS_Store
      │  ├─ baseAdapter.js
      │  ├─ database
      │  │  ├─ googleSheets.adapter.js
      │  │  ├─ mongo.adapter.js
      │  │  ├─ mysql.adapter.js
      │  │  └─ sqlite.adapter.js
      │  ├─ external
      │  │  └─ apiService.js
      │  └─ storage
      │     ├─ googleDrive.adapter.js
      │     └─ s3.adapter.js
      ├─ config
      │  ├─ README.md
      │  ├─ config.dev.js
      │  ├─ config.prod.js
      │  └─ index.js
      ├─ connections
      │  └─ multiMongoManager.js
      ├─ constants
      ├─ helpers
      │  ├─ datetime.helper.js
      │  ├─ error.helper.js
      │  ├─ file.helper.js
      │  ├─ format.helper.js
      │  ├─ logger.helper.js
      │  ├─ token.helper.js
      │  └─ whitelist.helper.js
      ├─ middlewares
      │  ├─ auth.middleware.js
      │  └─ theme.middleware.js
      ├─ repositories
      │  └─ MongoRepository.js
      └─ views
         ├─ .DS_Store
         └─ themes
            ├─ .DS_Store
            ├─ blank-theme
            │  ├─ main.ejs
            │  └─ partials
            │     └─ head.ejs
            ├─ dark-theme
            │  └─ main.ejs
            └─ light-theme
               ├─ main.ejs
               └─ partials
                  ├─ footer.ejs
                  ├─ head.ejs
                  ├─ header.ejs
                  └─ sidebar.ejs

```