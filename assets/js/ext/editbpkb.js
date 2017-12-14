Ext.Loader.setConfig({
	enabled: true
});

Ext.Loader.setPath('Ext.ux', gBaseUX);

Ext.require([
	'Ext.ux.form.NumericField',
	'Ext.ux.ProgressBarPager',
	'Ext.ProgressBar',
	'Ext.view.View',
]);

Ext.onReady(function() {
	Ext.QuickTips.init();
	Ext.util.Format.thousandSeparator = ',';
	Ext.util.Format.decimalSeparator = '.';

	var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

	Ext.define('DataGridBPKB', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_no_bpkb', type: 'string'},
		]
	});

	var grupDaftarBPKB = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridBPKB',
		pageSize: 25,
		proxy: {
			actionMethods: {
				read: 'POST'
			},
			reader: {
				rootProperty: 'hasil',
				totalProperty: 'total',
				type: 'json'
			},
			type: 'ajax',
			url: 'Caribpkb/griddaftarbpkb'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari').getValue()
				});
			}
		}		
	});

	var winGrid = Ext.create('Ext.grid.Panel', {
		anchor: '100%',
		autoDestroy: true,
		height: 450,
		width: 500,
		sortableColumns: false,
		store: grupDaftarBPKB,
		columns: [
			{xtype: 'rownumberer', width: 45},
			{text: "No. BPKB", dataIndex: 'fs_no_bpkb', menuDisabled: true, flex: 1},
		],
		tbar: [{
			flex: 1.4,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'No. BPKB',
				id: 'txtCari',
				name: 'txtCari',
				xtype: 'textfield'
			}]
		},{
			flex: 0.5,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '100%',
				text: 'Search',
				xtype: 'button',
				handler: function() {
					grupDaftarBPKB.load();
				}
			}]
		},{
			flex: 0.5,
			layout: 'anchor',
			xtype: 'container',
			items: []
		}],
		bbar: Ext.create('Ext.PagingToolbar', {
			displayInfo: true,
			pageSize: 25,
			plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
			store: grupDaftarBPKB,
			items:[
				'-', {
				text: 'Exit',
				handler: function() {
					winCari.hide();
				}
			}]
		}),
		listeners: {
			itemdblclick: function(grid, record) {
				Ext.getCmp('txtNoMesin').setValue(record.get('fs_no_mesin'));
				Ext.getCmp('txtNoRangka').setValue(record.get('fs_no_rangka'));
				Ext.getCmp('txtNoPolisi').setValue(record.get('fs_no_polisi'));
				Ext.getCmp('txtNoBPKB').setValue(record.get('fs_no_bpkb'));
				winCari.hide();
			}
		},
		viewConfig: {
			getRowClass: function() {
				return 'rowwrap';
			},
			markDirty: false
		}
	});

	var winCari = Ext.create('Ext.window.Window', {
		border: false,
		closable: false,
		draggable: true,
		frame: false,
		layout: 'fit',
		plain: true,
		resizable: false,
		title: 'Searching...',
		items: [
			winGrid
		],
		listeners: {
			beforehide: function() {
				vMask.hide();
			},
			beforeshow: function() {
				grupDaftarBPKB.load();
				vMask.show();
			}
		}
	});
	Ext.define('DataGridhistory', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_nama_cabang', type: 'string'},
			{name: 'fd_tgl_pindah', type: 'string'},
			{name: 'fs_user', type: 'string'},
		]
	});

	var grupHistory = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridhistory',
		pageSize: 25,
		proxy: {
			actionMethods: {
				read: 'POST'
			},
			reader: {
				rootProperty: 'hasil',
				totalProperty: 'total',
				type: 'json'
			},
			type: 'ajax',
			url: 'EditBPKB/History'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari2').getValue()
				});
			}
		}		
	});

	// GRID HISTORY
	var gridHistroy = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 400,
		sortableColumns: false,
		store: grupHistory,
		columns: [{
			xtype: 'rownumberer',
			width: 25
		},{
			text: 'Cabang',
			dataIndex: 'fs_nama_cabang',
			menuDisabled: true,
			flex: 1
		},{
			text: 'Tanggal',
			dataIndex: 'fd_tgl_pindah',
			menuDisabled: true,
			flex: 1
		},{
			text: 'User',
			dataIndex: 'fs_user',
			menuDisabled: true,
			flex: 1
		}],
		tbar: [{
			flex: 1,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'Cabang',
				id: 'txtCari2',
				name: 'txtCari2',
				xtype: 'textfield'
			}]
		},{
			flex: 0.2,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '100%',
				text: 'Search',
				xtype: 'button',
				handler: function() {
					grupHistory.load();
				}
			}]
		},{
			flex: 0.1,
			layout: 'anchor',
			xtype: 'container',
			items: []
		}],
		bbar: Ext.create('Ext.PagingToolbar', {
			displayInfo: true,
			pageSize: 25,
			plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
			store: grupHistory
		}),
		listeners: {
			itemdblclick: function(grid, record) {

				// CHANGE TAB
				var tabPanel = Ext.ComponentQuery.query('tabpanel')[0];
				tabPanel.setActiveTab('tab2');
			}
		},
		viewConfig: {
			getRowClass: function() {
				return 'rowwrap';
			},
			markDirty: false,
			stripeRows: true
		}
	});

	// COMPONENT FORM DARI BPKB
	var cboNoBPKB = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'No. BPKB',
		emptyText: 'No. BPKB / No. PJJ',
		fieldStyle: 'text-transform: uppercase;',
		id: 'cboNoBPKB',
		name: 'cboNoBPKB',
		xtype: 'textfield',
		triggers: {
			reset: {
				cls: 'x-form-clear-trigger',
				handler: function(field) {
					field.setValue('');
					Ext.getCmp('txtKdTransaksi').setValue('');
				}
			},
			cari: {
				cls: 'x-form-search-trigger',
				handler: function() {
					winCari.show();
					winCari.center();
				}
			}
		}
	};

	var txtNoPolisi = {
		anchor: '100%',
		fieldLabel: 'No. Polisi',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNoPolisi',
		name: 'txtNoPolisi',
		xtype: 'textfield'
	};

	var txtNoBPKB = {
		anchor: '100%',
		fieldLabel: 'No. BPKB',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNoBPKB',
		name: 'txtNoBPKB',
		xtype: 'textfield'
	};

	var txtNoRangka = {
		anchor: '100%',
		fieldLabel: 'Nomer Rangka',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNoRangka',
		name: 'txtNoRangka',
		xtype: 'textfield'
	};

	var txtNoMesin = {
		anchor: '100%',
		fieldLabel: 'Nomer Mesin',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNoMesin',
		name: 'txtNoMesin',
		xtype: 'textfield'
	};

	// COMPONENT FORM KE BPKB

	var txtNoPolisi1 = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'No. Polisi',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNoPolisi1',
		name: 'txtNoPolisi1',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 25,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtNoBPKB1 = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'No. BPKB',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNoBPKB1',
		name: 'txtNoBPKB1',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 25,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtNoRangka1 = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'No. Rangka',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNoRangka1',
		name: 'txtNoRangka1',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 25,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtNoMesin1 = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'No. Mesin',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNoMesin1',
		name: 'txtNoMesin1',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 25,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var btnSave = {
		anchor: '100%',
		scale: 'medium',
		xtype: 'button',
		id: 'btnSave',
		name: 'btnSave',
		text: 'Update',
		iconCls: 'icon-save',
		handler: ''
	};

	var frmEditDataBPKB = Ext.create('Ext.form.Panel', {
		border: false,
		frame: true,
		region: 'center',
		title: 'Edit Data BPKB',
		width: 930,
		items: [{
			activeTab: 0,
			bodyStyle: 'padding: 5px; background-color: '.concat(gBasePanel),
			border: false,
			plain: true,
			xtype: 'tabpanel',
			items: [{
				id: 'tab1',
				bodyStyle: 'background-color: '.concat(gBasePanel),
				border: false,
				frame: false,
				title: 'Edit Data BPKB',
				xtype: 'form',
				items: [{
					fieldDefaults: {
						labelAlign: 'right',
						labelSeparator: '',
						labelWidth: 100,
						msgTarget: 'side'
					},	
					xtype: 'fieldset',
					border: false,
					style: 'padding: 1px;',
					items: [{
						anchor: '100%',
						layout: 'hbox',
						xtype: 'container',
						items: [{
							flex: 1,
							layout: 'anchor',
							xtype: 'container',
							items: [{
								anchor: '98%',
								style: 'padding: 5px;',
								title: 'Dari',
								xtype: 'fieldset',
								items: [
									cboNoBPKB,
									txtNoPolisi,
									txtNoBPKB,
									txtNoRangka,
									txtNoMesin
								]
							}]
						},{
							flex: 1,
							layout: 'anchor',
							xtype: 'container',
							items: [{
								anchor: '100%',
								style: 'padding: 7px;',
								title: 'Ke',
								xtype: 'fieldset',
								items: [
									txtNoPolisi1,
									txtNoBPKB1,
									txtNoRangka1,
									txtNoMesin1
								]
							},{
								flex: 1,
								layout: 'anchor',
								xtype: 'container',
								items: [
									btnSave
								]
							}]
						}]
					}]
				}]
			},{

				id: 'tab2',
				bodyStyle: 'background-color: '.concat(gBasePanel),
				border: false,
				frame: false,
				xtype: 'form',
				title: 'History',
				items: [{
					fieldDefaults: {
						labelAlign: 'right',
						labelSeparator: '',
						labelWidth: 120,
						msgTarget: 'side'
					},
					style: 'padding: 5px;',
					title: 'History',
					xtype: 'fieldset',
					items: [
						gridHistroy
					]
				}]
			}]
		}]
	});

	var vMask = new Ext.LoadMask({
		msg: 'Please wait...',
		target: frmEditDataBPKB
	});

	function fnMaskShow() {
		frmEditDataBPKB.mask('Please wait...');
	}

	function fnMaskHide() {
		frmEditDataBPKB.unmask();
	}
	
	frmEditDataBPKB.render(Ext.getBody());
	Ext.get('loading').destroy();
});