sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./Dialog4", "./Dialog5",
	"./utilities",
	"sap/ui/core/routing/History"
], function (BaseController, MessageBox, Dialog4, Dialog5, Utilities, History) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.eventosPesca.controller.DetailPage1", {
		handleRouteMatched: function (oEvent) {
			var sAppId = "App60ffba56421c8929c55fe383";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function (oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype" && prop.includes("Set")) {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

				}
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		_onTableDelete: function () {
			return new Promise(function (fnResolve) {
				sap.m.MessageBox.confirm("Esta seguro de eliminar este evento ?", {
					title: "Eliminar Evento",
					actions: ["Ok", "Cancelar"],
					onClose: function (sActionClicked) {
						fnResolve(sActionClicked === "Ok");
					}
				});
			}).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err);
				}
			});

		},
		_onOverflowToolbarButtonPress: function (oEvent) {

			var sDialogName = "Dialog4";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Dialog4(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext();
			oDialog._oControl.setBindingContext(context);

			oDialog.open();

		},
		_onRowPress: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function (fnResolve) {

				this.doNavigate("DetailPage2", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

			var sEntityNameSet;
			if (sPath !== null && sPath !== "") {
				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				sEntityNameSet = sPath.split("(")[0];
			}
			var sNavigationPropertyName;
			var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

			if (sEntityNameSet !== null) {
				sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet,
					sRouteName);
			}
			if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
				if (sNavigationPropertyName === "") {
					this.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function (bindingContext) {
						if (bindingContext) {
							sPath = bindingContext.getPath();
							if (sPath.substring(0, 1) === "/") {
								sPath = sPath.substring(1);
							}
						} else {
							sPath = "undefined";
						}

						// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
						if (sPath === "undefined") {
							this.oRouter.navTo(sRouteName);
						} else {
							this.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					}.bind(this));
				}
			} else {
				this.oRouter.navTo(sRouteName);
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		},
		_onButtonPress: function (oEvent) {

			var sDialogName = "Dialog5";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Dialog5(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext();
			oDialog._oControl.setBindingContext(context);

			oDialog.open();

		},
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("DetailPage1").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			var oView = this.getView();
			oView.addEventDelegate({
				onBeforeShow: function () {
					if (sap.ui.Device.system.phone) {
						var oPage = oView.getContent()[0];
						if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
							oPage.setShowNavButton(true);
							oPage.attachNavButtonPress(function () {
								this.oRouter.navTo("", {}, true);
							}.bind(this));
						}
					}
				}.bind(this)
			});

			var model = new sap.ui.model.json.JSONModel([{
				"ID": "01",
				"TipoEvento": "Zarpe",
				"FechIni": "30/07/2021 15:18",
				"FechFin": "30/07/2021 15:18",
				"ZonaPesca": "CHIMBOTE",
				"Puerto": "CHIMBOTE",
				"Planta": "CHIMBOTE"
			}, {
				"ID": "02",
				"TipoEvento": "Llegada a Zona de Pesca",
				"FechIni": "30/07/2021 15:20",
				"FechFin": "30/07/2021 15:20",
				"ZonaPesca": "CHIMBOTE",
				"Puerto": "CHIMBOTE",
				"Planta": "CHIMBOTE"
			}, {
				"ID": "03",
				"TipoEvento": "Cala",
				"FechIni": "30/07/2021 16:35",
				"FechFin": "30/07/2021 16:35",
				"ZonaPesca": "CHIMBOTE",
				"Puerto": "CHIMBOTE",
				"Planta": "CHIMBOTE"
			}, {
				"ID": "04",
				"TipoEvento": "Salida de Zona de Pesca",
				"FechIni": "30/07/2021 16:25",
				"FechFin": "30/07/2021 15:18",
				"ZonaPesca": "CHIMBOTE",
				"Puerto": "CHIMBOTE",
				"Planta": "CHIMBOTE"
			}, {
				"ID": "05",
				"TipoEvento": "Llegada a Zona de Pesca",
				"FechIni": "30/07/2021 15:18",
				"FechFin": "30/07/2021 15:18",
				"ZonaPesca": "CHIMBOTE",
				"Puerto": "CHIMBOTE",
				"Planta": "CHIMBOTE"
			}, {
				"ID": "06",
				"TipoEvento": "Cala",
				"FechIni": "30/07/2021 15:18",
				"FechFin": "30/07/2021 15:18",
				"ZonaPesca": "CHIMBOTE",
				"Puerto": "CHIMBOTE",
				"Planta": "CHIMBOTE"
			}, {
				"ID": "07",
				"TipoEvento": "Salida de Zona de Pesca",
				"FechIni": "30/07/2021 15:18",
				"FechFin": "30/07/2021 15:18",
				"ZonaPesca": "CHIMBOTE",
				"Puerto": "CHIMBOTE",
				"Planta": "CHIMBOTE"
			}]);
			var lista = this.byId("tblEventos");
			lista.setModel(model);

		},
		onExit: function () {

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			var aControls = [{
				"controlId": "sap_Responsive_Page_0-content-sap_m_IconTabBar-1627680210974-items-sap_m_IconTabFilter-3-content-build_simple_Table-1627682180289",
				"groups": ["items"]
			}];
			for (var i = 0; i < aControls.length; i++) {
				var oControl = this.getView().byId(aControls[i].controlId);
				if (oControl) {
					for (var j = 0; j < aControls[i].groups.length; j++) {
						var sAggregationName = aControls[i].groups[j];
						var oBindingInfo = oControl.getBindingInfo(sAggregationName);
						if (oBindingInfo) {
							var oTemplate = oBindingInfo.template;
							oTemplate.destroy();
						}
					}
				}
			}

		}
	});
}, /* bExport= */ true);