"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var http_1 = require("@angular/http");
var forms_1 = require("@angular/forms");
var college_service_1 = require("../services/college.service");
var undergraddegree_service_1 = require("../services/undergraddegree.service");
var department_service_1 = require("../services/department.service");
var course_service_1 = require("../services/course.service");
var pubsubevent_service_1 = require("../services/pubsubevent.service");
var app_component_1 = require("../components/app.component");
var app_leftbar_1 = require("../components/app.leftbar");
var app_rightbar_1 = require("../components/app.rightbar");
var app_graphDisplay_1 = require("../components/app.graphDisplay");
var app_nav_1 = require("../components/app.nav");
var app_pageFooter_1 = require("../components/app.pageFooter");
var app_toolbar_1 = require("../components/app.toolbar");
var app_courseCard_1 = require("../components/app.courseCard");
var app_modal_1 = require("../components/app.modal");
var app_tabs_1 = require("../components/app.tabs");
var app_cardContainer_1 = require("../components/app.cardContainer");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            http_1.HttpModule,
            forms_1.FormsModule
        ],
        declarations: [
            app_component_1.AppComponent,
            app_leftbar_1.LeftBarComponent,
            app_rightbar_1.RightBarComponent,
            app_graphDisplay_1.graphDisplayComponent,
            app_nav_1.NavComponent,
            app_pageFooter_1.PageFooterComponent,
            app_toolbar_1.ToolbarComponent,
            app_courseCard_1.courseCardComponent,
            app_modal_1.ModalComponent,
            app_tabs_1.TabsComponent,
            app_cardContainer_1.CardContainerComponent
        ],
        bootstrap: [
            app_component_1.AppComponent
        ],
        providers: [
            college_service_1.CollegeService,
            undergraddegree_service_1.UndergradDegreeService,
            department_service_1.DepartmentService,
            course_service_1.CourseService,
            pubsubevent_service_1.PubSubEventService
        ]
    })
], AppModule);
exports.AppModule = AppModule;
