"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/me/route";
exports.ids = ["app/api/auth/me/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "node:buffer":
/*!******************************!*\
  !*** external "node:buffer" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:buffer");

/***/ }),

/***/ "node:crypto":
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),

/***/ "node:util":
/*!****************************!*\
  !*** external "node:util" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("node:util");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fme%2Froute&page=%2Fapi%2Fauth%2Fme%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fme%2Froute.ts&appDir=E%3A%5CMy_Projects%5CGithub%20Files%5COngoing%5CBidShield_AI%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=E%3A%5CMy_Projects%5CGithub%20Files%5COngoing%5CBidShield_AI&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fme%2Froute&page=%2Fapi%2Fauth%2Fme%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fme%2Froute.ts&appDir=E%3A%5CMy_Projects%5CGithub%20Files%5COngoing%5CBidShield_AI%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=E%3A%5CMy_Projects%5CGithub%20Files%5COngoing%5CBidShield_AI&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var E_My_Projects_Github_Files_Ongoing_BidShield_AI_app_api_auth_me_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/me/route.ts */ \"(rsc)/./app/api/auth/me/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/me/route\",\n        pathname: \"/api/auth/me\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/me/route\"\n    },\n    resolvedPagePath: \"E:\\\\My_Projects\\\\Github Files\\\\Ongoing\\\\BidShield_AI\\\\app\\\\api\\\\auth\\\\me\\\\route.ts\",\n    nextConfigOutput,\n    userland: E_My_Projects_Github_Files_Ongoing_BidShield_AI_app_api_auth_me_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/me/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGbWUlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkZtZSUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkZtZSUyRnJvdXRlLnRzJmFwcERpcj1FJTNBJTVDTXlfUHJvamVjdHMlNUNHaXRodWIlMjBGaWxlcyU1Q09uZ29pbmclNUNCaWRTaGllbGRfQUklNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUUlM0ElNUNNeV9Qcm9qZWN0cyU1Q0dpdGh1YiUyMEZpbGVzJTVDT25nb2luZyU1Q0JpZFNoaWVsZF9BSSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDa0M7QUFDL0c7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iaWRzaGllbGQtYWkvPzc5ZGMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiRTpcXFxcTXlfUHJvamVjdHNcXFxcR2l0aHViIEZpbGVzXFxcXE9uZ29pbmdcXFxcQmlkU2hpZWxkX0FJXFxcXGFwcFxcXFxhcGlcXFxcYXV0aFxcXFxtZVxcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYXV0aC9tZS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2F1dGgvbWVcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2F1dGgvbWUvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJFOlxcXFxNeV9Qcm9qZWN0c1xcXFxHaXRodWIgRmlsZXNcXFxcT25nb2luZ1xcXFxCaWRTaGllbGRfQUlcXFxcYXBwXFxcXGFwaVxcXFxhdXRoXFxcXG1lXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9hdXRoL21lL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fme%2Froute&page=%2Fapi%2Fauth%2Fme%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fme%2Froute.ts&appDir=E%3A%5CMy_Projects%5CGithub%20Files%5COngoing%5CBidShield_AI%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=E%3A%5CMy_Projects%5CGithub%20Files%5COngoing%5CBidShield_AI&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/auth/me/route.ts":
/*!**********************************!*\
  !*** ./app/api/auth/me/route.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./lib/db.ts\");\n\n\n\nasync function GET(req) {\n    const session = await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_1__.getSession)(req);\n    if (!session) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: false,\n            error: {\n                code: \"UNAUTHORIZED\",\n                message: \"Not authenticated\"\n            }\n        }, {\n            status: 401\n        });\n    }\n    const user = await _lib_db__WEBPACK_IMPORTED_MODULE_2__.prisma.user.findUnique({\n        where: {\n            id: session.userId\n        },\n        include: {\n            department: true\n        }\n    });\n    if (!user) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: false,\n            error: {\n                code: \"NOT_FOUND\",\n                message: \"User not found\"\n            }\n        }, {\n            status: 404\n        });\n    }\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        success: true,\n        user: {\n            id: user.id,\n            name: user.name,\n            email: user.email,\n            role: user.role,\n            department: user.department?.name || \"Ministry Division\",\n            designation: user.designation,\n            avatar: user.avatar\n        }\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvbWUvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUF3RDtBQUNoQjtBQUNOO0FBRTNCLGVBQWVHLElBQUlDLEdBQWdCO0lBQ3hDLE1BQU1DLFVBQVUsTUFBTUoscURBQVVBLENBQUNHO0lBQ2pDLElBQUksQ0FBQ0MsU0FBUztRQUNaLE9BQU9MLHFEQUFZQSxDQUFDTSxJQUFJLENBQUM7WUFBRUMsU0FBUztZQUFPQyxPQUFPO2dCQUFFQyxNQUFNO2dCQUFnQkMsU0FBUztZQUFvQjtRQUFFLEdBQUc7WUFBRUMsUUFBUTtRQUFJO0lBQzVIO0lBRUEsTUFBTUMsT0FBTyxNQUFNViwyQ0FBTUEsQ0FBQ1UsSUFBSSxDQUFDQyxVQUFVLENBQUM7UUFDeENDLE9BQU87WUFBRUMsSUFBSVYsUUFBUVcsTUFBTTtRQUFDO1FBQzVCQyxTQUFTO1lBQUVDLFlBQVk7UUFBSztJQUM5QjtJQUVBLElBQUksQ0FBQ04sTUFBTTtRQUNULE9BQU9aLHFEQUFZQSxDQUFDTSxJQUFJLENBQUM7WUFBRUMsU0FBUztZQUFPQyxPQUFPO2dCQUFFQyxNQUFNO2dCQUFhQyxTQUFTO1lBQWlCO1FBQUUsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDdEg7SUFFQSxPQUFPWCxxREFBWUEsQ0FBQ00sSUFBSSxDQUFDO1FBQ3ZCQyxTQUFTO1FBQ1RLLE1BQU07WUFDSkcsSUFBSUgsS0FBS0csRUFBRTtZQUNYSSxNQUFNUCxLQUFLTyxJQUFJO1lBQ2ZDLE9BQU9SLEtBQUtRLEtBQUs7WUFDakJDLE1BQU1ULEtBQUtTLElBQUk7WUFDZkgsWUFBWU4sS0FBS00sVUFBVSxFQUFFQyxRQUFRO1lBQ3JDRyxhQUFhVixLQUFLVSxXQUFXO1lBQzdCQyxRQUFRWCxLQUFLVyxNQUFNO1FBQ3JCO0lBQ0Y7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL2JpZHNoaWVsZC1haS8uL2FwcC9hcGkvYXV0aC9tZS9yb3V0ZS50cz9jNzIzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XHJcbmltcG9ydCB7IGdldFNlc3Npb24gfSBmcm9tICdAL2xpYi9hdXRoJztcclxuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvZGInO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVChyZXE6IE5leHRSZXF1ZXN0KSB7XHJcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlc3Npb24ocmVxKTtcclxuICBpZiAoIXNlc3Npb24pIHtcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogeyBjb2RlOiAnVU5BVVRIT1JJWkVEJywgbWVzc2FnZTogJ05vdCBhdXRoZW50aWNhdGVkJyB9IH0sIHsgc3RhdHVzOiA0MDEgfSk7XHJcbiAgfVxyXG5cclxuICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7XHJcbiAgICB3aGVyZTogeyBpZDogc2Vzc2lvbi51c2VySWQgfSxcclxuICAgIGluY2x1ZGU6IHsgZGVwYXJ0bWVudDogdHJ1ZSB9LFxyXG4gIH0pO1xyXG5cclxuICBpZiAoIXVzZXIpIHtcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogeyBjb2RlOiAnTk9UX0ZPVU5EJywgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJyB9IH0sIHsgc3RhdHVzOiA0MDQgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oe1xyXG4gICAgc3VjY2VzczogdHJ1ZSxcclxuICAgIHVzZXI6IHtcclxuICAgICAgaWQ6IHVzZXIuaWQsXHJcbiAgICAgIG5hbWU6IHVzZXIubmFtZSxcclxuICAgICAgZW1haWw6IHVzZXIuZW1haWwsXHJcbiAgICAgIHJvbGU6IHVzZXIucm9sZSxcclxuICAgICAgZGVwYXJ0bWVudDogdXNlci5kZXBhcnRtZW50Py5uYW1lIHx8ICdNaW5pc3RyeSBEaXZpc2lvbicsXHJcbiAgICAgIGRlc2lnbmF0aW9uOiB1c2VyLmRlc2lnbmF0aW9uLFxyXG4gICAgICBhdmF0YXI6IHVzZXIuYXZhdGFyLFxyXG4gICAgfSxcclxuICB9KTtcclxufVxyXG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiZ2V0U2Vzc2lvbiIsInByaXNtYSIsIkdFVCIsInJlcSIsInNlc3Npb24iLCJqc29uIiwic3VjY2VzcyIsImVycm9yIiwiY29kZSIsIm1lc3NhZ2UiLCJzdGF0dXMiLCJ1c2VyIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwiaWQiLCJ1c2VySWQiLCJpbmNsdWRlIiwiZGVwYXJ0bWVudCIsIm5hbWUiLCJlbWFpbCIsInJvbGUiLCJkZXNpZ25hdGlvbiIsImF2YXRhciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/me/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getSession: () => (/* binding */ getSession),\n/* harmony export */   signToken: () => (/* binding */ signToken),\n/* harmony export */   verifyToken: () => (/* binding */ verifyToken)\n/* harmony export */ });\n/* harmony import */ var jose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jose */ \"(rsc)/./node_modules/jose/dist/node/esm/jwt/sign.js\");\n/* harmony import */ var jose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jose */ \"(rsc)/./node_modules/jose/dist/node/esm/jwt/verify.js\");\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n\n\nconst JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || \"bidshield-super-secret-jwt-key-2026-sih26100\");\nasync function signToken(payload) {\n    return await new jose__WEBPACK_IMPORTED_MODULE_1__.SignJWT({\n        ...payload\n    }).setProtectedHeader({\n        alg: \"HS256\"\n    }).setIssuedAt().setExpirationTime(\"24h\").sign(JWT_SECRET);\n}\nasync function verifyToken(token) {\n    try {\n        const verified = await (0,jose__WEBPACK_IMPORTED_MODULE_2__.jwtVerify)(token, JWT_SECRET);\n        return verified.payload;\n    } catch (error) {\n        return null;\n    }\n}\nasync function getSession(req) {\n    let token;\n    if (req) {\n        token = req.cookies.get(\"token\")?.value;\n        if (!token) {\n            const authHeader = req.headers.get(\"authorization\");\n            if (authHeader?.startsWith(\"Bearer \")) {\n                token = authHeader.substring(7);\n            }\n        }\n    } else {\n        const cookieStore = (0,next_headers__WEBPACK_IMPORTED_MODULE_0__.cookies)();\n        token = cookieStore.get(\"token\")?.value;\n    }\n    if (!token) return null;\n    return await verifyToken(token);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBMEM7QUFDSDtBQUd2QyxNQUFNRyxhQUFhLElBQUlDLGNBQWNDLE1BQU0sQ0FDekNDLFFBQVFDLEdBQUcsQ0FBQ0osVUFBVSxJQUFJO0FBWXJCLGVBQWVLLFVBQVVDLE9BQW1CO0lBQ2pELE9BQU8sTUFBTSxJQUFJVCx5Q0FBT0EsQ0FBQztRQUFFLEdBQUdTLE9BQU87SUFBQyxHQUNuQ0Msa0JBQWtCLENBQUM7UUFBRUMsS0FBSztJQUFRLEdBQ2xDQyxXQUFXLEdBQ1hDLGlCQUFpQixDQUFDLE9BQ2xCQyxJQUFJLENBQUNYO0FBQ1Y7QUFFTyxlQUFlWSxZQUFZQyxLQUFhO0lBQzdDLElBQUk7UUFDRixNQUFNQyxXQUFXLE1BQU1oQiwrQ0FBU0EsQ0FBQ2UsT0FBT2I7UUFDeEMsT0FBT2MsU0FBU1IsT0FBTztJQUN6QixFQUFFLE9BQU9TLE9BQU87UUFDZCxPQUFPO0lBQ1Q7QUFDRjtBQUVPLGVBQWVDLFdBQVdDLEdBQWlCO0lBQ2hELElBQUlKO0lBRUosSUFBSUksS0FBSztRQUNQSixRQUFRSSxJQUFJbEIsT0FBTyxDQUFDbUIsR0FBRyxDQUFDLFVBQVVDO1FBQ2xDLElBQUksQ0FBQ04sT0FBTztZQUNWLE1BQU1PLGFBQWFILElBQUlJLE9BQU8sQ0FBQ0gsR0FBRyxDQUFDO1lBQ25DLElBQUlFLFlBQVlFLFdBQVcsWUFBWTtnQkFDckNULFFBQVFPLFdBQVdHLFNBQVMsQ0FBQztZQUMvQjtRQUNGO0lBQ0YsT0FBTztRQUNMLE1BQU1DLGNBQWN6QixxREFBT0E7UUFDM0JjLFFBQVFXLFlBQVlOLEdBQUcsQ0FBQyxVQUFVQztJQUNwQztJQUVBLElBQUksQ0FBQ04sT0FBTyxPQUFPO0lBQ25CLE9BQU8sTUFBTUQsWUFBWUM7QUFDM0IiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iaWRzaGllbGQtYWkvLi9saWIvYXV0aC50cz9iZjdlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNpZ25KV1QsIGp3dFZlcmlmeSB9IGZyb20gJ2pvc2UnO1xyXG5pbXBvcnQgeyBjb29raWVzIH0gZnJvbSAnbmV4dC9oZWFkZXJzJztcclxuaW1wb3J0IHsgTmV4dFJlcXVlc3QgfSBmcm9tICduZXh0L3NlcnZlcic7XHJcblxyXG5jb25zdCBKV1RfU0VDUkVUID0gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKFxyXG4gIHByb2Nlc3MuZW52LkpXVF9TRUNSRVQgfHwgJ2JpZHNoaWVsZC1zdXBlci1zZWNyZXQtand0LWtleS0yMDI2LXNpaDI2MTAwJ1xyXG4pO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBKV1RQYXlsb2FkIHtcclxuICB1c2VySWQ6IHN0cmluZztcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgZW1haWw6IHN0cmluZztcclxuICByb2xlOiAnQURNSU4nIHwgJ1BST0NVUkVNRU5UX09GRklDRVInIHwgJ0JJRERFUicgfCAnQVVESVRPUic7XHJcbiAgZGVwYXJ0bWVudElkPzogc3RyaW5nO1xyXG4gIGRlc2lnbmF0aW9uPzogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2lnblRva2VuKHBheWxvYWQ6IEpXVFBheWxvYWQpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gIHJldHVybiBhd2FpdCBuZXcgU2lnbkpXVCh7IC4uLnBheWxvYWQgfSlcclxuICAgIC5zZXRQcm90ZWN0ZWRIZWFkZXIoeyBhbGc6ICdIUzI1NicgfSlcclxuICAgIC5zZXRJc3N1ZWRBdCgpXHJcbiAgICAuc2V0RXhwaXJhdGlvblRpbWUoJzI0aCcpXHJcbiAgICAuc2lnbihKV1RfU0VDUkVUKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHZlcmlmeVRva2VuKHRva2VuOiBzdHJpbmcpOiBQcm9taXNlPEpXVFBheWxvYWQgfCBudWxsPiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHZlcmlmaWVkID0gYXdhaXQgand0VmVyaWZ5KHRva2VuLCBKV1RfU0VDUkVUKTtcclxuICAgIHJldHVybiB2ZXJpZmllZC5wYXlsb2FkIGFzIHVua25vd24gYXMgSldUUGF5bG9hZDtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0U2Vzc2lvbihyZXE/OiBOZXh0UmVxdWVzdCk6IFByb21pc2U8SldUUGF5bG9hZCB8IG51bGw+IHtcclxuICBsZXQgdG9rZW46IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuXHJcbiAgaWYgKHJlcSkge1xyXG4gICAgdG9rZW4gPSByZXEuY29va2llcy5nZXQoJ3Rva2VuJyk/LnZhbHVlO1xyXG4gICAgaWYgKCF0b2tlbikge1xyXG4gICAgICBjb25zdCBhdXRoSGVhZGVyID0gcmVxLmhlYWRlcnMuZ2V0KCdhdXRob3JpemF0aW9uJyk7XHJcbiAgICAgIGlmIChhdXRoSGVhZGVyPy5zdGFydHNXaXRoKCdCZWFyZXIgJykpIHtcclxuICAgICAgICB0b2tlbiA9IGF1dGhIZWFkZXIuc3Vic3RyaW5nKDcpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGNvbnN0IGNvb2tpZVN0b3JlID0gY29va2llcygpO1xyXG4gICAgdG9rZW4gPSBjb29raWVTdG9yZS5nZXQoJ3Rva2VuJyk/LnZhbHVlO1xyXG4gIH1cclxuXHJcbiAgaWYgKCF0b2tlbikgcmV0dXJuIG51bGw7XHJcbiAgcmV0dXJuIGF3YWl0IHZlcmlmeVRva2VuKHRva2VuKTtcclxufVxyXG4iXSwibmFtZXMiOlsiU2lnbkpXVCIsImp3dFZlcmlmeSIsImNvb2tpZXMiLCJKV1RfU0VDUkVUIiwiVGV4dEVuY29kZXIiLCJlbmNvZGUiLCJwcm9jZXNzIiwiZW52Iiwic2lnblRva2VuIiwicGF5bG9hZCIsInNldFByb3RlY3RlZEhlYWRlciIsImFsZyIsInNldElzc3VlZEF0Iiwic2V0RXhwaXJhdGlvblRpbWUiLCJzaWduIiwidmVyaWZ5VG9rZW4iLCJ0b2tlbiIsInZlcmlmaWVkIiwiZXJyb3IiLCJnZXRTZXNzaW9uIiwicmVxIiwiZ2V0IiwidmFsdWUiLCJhdXRoSGVhZGVyIiwiaGVhZGVycyIsInN0YXJ0c1dpdGgiLCJzdWJzdHJpbmciLCJjb29raWVTdG9yZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/db.ts":
/*!*******************!*\
  !*** ./lib/db.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log:  true ? [\n        \"query\",\n        \"error\",\n        \"warn\"\n    ] : 0\n});\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQThDO0FBRTlDLE1BQU1DLGtCQUFrQkM7QUFJakIsTUFBTUMsU0FDWEYsZ0JBQWdCRSxNQUFNLElBQ3RCLElBQUlILHdEQUFZQSxDQUFDO0lBQ2ZJLEtBQUtDLEtBQXlCLEdBQWdCO1FBQUM7UUFBUztRQUFTO0tBQU8sR0FBRyxDQUFTO0FBQ3RGLEdBQUc7QUFFTCxJQUFJQSxJQUF5QixFQUFjSixnQkFBZ0JFLE1BQU0sR0FBR0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iaWRzaGllbGQtYWkvLi9saWIvZGIudHM/MWRmMCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tICdAcHJpc21hL2NsaWVudCc7XHJcblxyXG5jb25zdCBnbG9iYWxGb3JQcmlzbWEgPSBnbG9iYWxUaGlzIGFzIHVua25vd24gYXMge1xyXG4gIHByaXNtYTogUHJpc21hQ2xpZW50IHwgdW5kZWZpbmVkO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHByaXNtYSA9XHJcbiAgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA/P1xyXG4gIG5ldyBQcmlzbWFDbGllbnQoe1xyXG4gICAgbG9nOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyA/IFsncXVlcnknLCAnZXJyb3InLCAnd2FybiddIDogWydlcnJvciddLFxyXG4gIH0pO1xyXG5cclxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPSBwcmlzbWE7XHJcbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJnbG9iYWxGb3JQcmlzbWEiLCJnbG9iYWxUaGlzIiwicHJpc21hIiwibG9nIiwicHJvY2VzcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/db.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/jose"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fme%2Froute&page=%2Fapi%2Fauth%2Fme%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fme%2Froute.ts&appDir=E%3A%5CMy_Projects%5CGithub%20Files%5COngoing%5CBidShield_AI%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=E%3A%5CMy_Projects%5CGithub%20Files%5COngoing%5CBidShield_AI&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();