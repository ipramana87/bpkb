
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

	Ext.define('DataGridPenyimpanan', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_nama_loker', type: 'string'},
		]
	});

	Ext.define('DataGridPenyimpananBPKB', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_kode_cabang', type: 'string'},
			{name: 'fs_kode_brangkas', type: 'string'},
			{name: 'fs_nama_brangkas', type: 'string'},
		]
	});

	var grupMasterPenyimpananBPKB = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridPenyimpananBPKB',
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
			url: 'masterpenyimpanan/grid'
		},listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari').getValue()
				});
			}
		}		
	});

	var grupMasterPenyimpanan = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridPenyimpanan',
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
			url: 'masterpenyimpanan/gridpenyimpanan'
		},listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari').getValue()
				});
			}
		}		
	});

	var grupCabang = Ext.create('Ext.data.Store', {
		autoLoad: false,
		fields: [
			'fs_kode_cabang','fs_nama_cabang'
		],
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
			url: 'masterpenyimpanan/gridcabang'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari1').getValue()
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
		store: grupCabang,
		columns: [
			{xtype: 'rownumberer', width: 45},
			{text: "Kode Cabang", dataIndex: 'fs_kode_cabang', menuDisabled: true, flex: 1},
			{text: "Nama Cabang", dataIndex: 'fs_nama_cabang', menuDisabled: true, flex: 3}
		],
		tbar: [{
			flex: 1.4,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'Nama Cabang',
				id: 'txtCari1',
				name: 'txtCari1',
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
					grupCabang.load();
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
			store: grupCabang,
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
				Ext.getCmp('cboCabang').setValue(record.get('fs_nama_cabang'));
				Ext.getCmp('txtKdCabang').setValue(record.get('fs_kode_cabang'));
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
				grupCabang.load();
				vMask.show();
			}
		}
	});


	// COMPONENT FORM MASTER Penyimpanan
	var txtKdCabang = {
		id: 'txtKdCabang',
		name: 'txtKdCabang',
		xtype: 'textfield',
		hidden: true
	};

	var cboCabang = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Nama Cabang',
		emptyText: 'Nama Cabang',
		fieldStyle: 'text-transform: uppercase;',
		id: 'cboCabang',
		name: 'cboCabang',
		xtype: 'textfield',
		triggers: {
			reset: {
				cls: 'x-form-clear-trigger',
				handler: function(field) {
					field.setValue('');
					Ext.getCmp('txtKdCabang').setValue('');
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


	var txtKodeBrangkas = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Kode Brangkas',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtKodeBrangkas',
		name: 'txtKodeBrangkas',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 35,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtNamaBrangkas = {
		afterLabelTextTpl: required,
		allowBlank: false,
		allowDecimals: false,
		allowNegative: false,
		anchor: '100%',
		fieldLabel: 'Nama Brangkas',
		id: 'txtNamaBrangkas',
		name: 'txtNamaBrangkas',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 35,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtNamaLoker = {
		anchor: '98%',
		fieldLabel: 'Nama Loker',
		emptyText: '',
		labelAlign: 'top',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNamaLoker',
		name: 'txtNamaLoker',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 35,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var btnSave = {
		anchor: '90%',
		scale: 'medium',
		xtype: 'button',
		id: 'btnSave',
		name: 'btnSave',
		text: 'Save',
		iconCls: 'icon-save',
		handler: fnCekSave
	};

	var btnReset = {
		anchor: '90%',
		scale: 'medium',
		xtype: 'button',
		id: 'btnReset',
		name: 'btnReset',
		text: 'Reset',
		iconCls: 'icon-reset',
		handler: fnReset
	};



	// GRID Master Penyimpanan
	var gridMasterPenyimpanan = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 500,
		sortableColumns: false,
		store: grupMasterPenyimpanan,
		columns: [{
			xtype: 'rownumberer',
			width: 45
		},{
			flex: 1,
			text: 'Nama Loker ',
			dataIndex: 'fs_nama_loker',
			menuDisabled: true,
			width: 80,
		}],
		tbar: [{
			flex:1,
			layout: 'anchor',
			xtype: 'container',
			items: [
				txtNamaLoker
			]
		},{

			flex: 0.1,
			layout: 'anchor',
			xtype: 'container',
			items: []
		},{
			xtype: 'buttongroup',
			columns: 1,
			defaults: {
				scale: 'small'
			},
			items: [{
				iconCls: 'icon-add',
				text: 'Add',
				handler: function() {
					var total = grupMasterPenyimpanan.getCount();

					var data = Ext.create('DataGridPenyimpanan', {
						fs_nama_loker: Ext.getCmp('txtNamaLoker').getValue(),

					});

					var nama_loker = Ext.getCmp('txtNamaLoker').getValue();
					if (nama_loker === '') {
						Ext.MessageBox.show({
							buttons: Ext.MessageBox.OK,
							closable: false,
							icon: Ext.Msg.WARNING,
							msg: 'Nama Loker, belum diisi',
							title: 'MFAS'
						});
						return;
					}

					grupMasterPenyimpanan.insert(total, data);

					Ext.getCmp('txtNamaLoker').setValue('');
					
					total = grupMasterPenyimpanan.getCount() - 1;
					gridMasterPenyimpanan.getSelectionModel().select(total);
				}
			},{
				iconCls: 'icon-delete',
				itemId: 'removeData',
				text: 'Delete',
				handler: function() {

					var sm = gridMasterPenyimpanan.getSelectionModel();
					grupMasterPenyimpanan.remove(sm.getSelection());
					gridMasterPenyimpanan.getView().refresh();

					if (grupMasterPenyimpanan.getCount() > 0) {
						sm.select(0);
					}
				},
				disabled: true
			}]
		}],
		bbar: Ext.create('Ext.PagingToolbar', {
			displayInfo: true,
			pageSize: 25,
			plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
			store: grupMasterPenyimpanan
		}),
		listeners: {
			selectionchange: function(view, records) {
				gridMasterPenyimpanan.down('#removeData').setDisabled(!records.length);
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

	var gridMasterPenyimpananBPKB = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 450,
		sortableColumns: false,
		store: grupMasterPenyimpananBPKB,
		columns: [{
			xtype: 'rownumberer',
			width: 25
		},{
			flex: 1,
			text: 'Nama Cabang',
			dataIndex: 'fs_nama_cabang',
			menuDisabled: true,
			width: 100
		},{
			flex: 1,
			text: 'Kode Brangkas',
			dataIndex: 'fs_kode_brangkas',
			menuDisabled: true,
			width: 100
		},{
			flex: 1,
			text: 'Nama Brangkas',
			dataIndex: 'fs_nama_brangkas',
			menuDisabled: true,
			width: 100			
		},{
			xtype:'actioncolumn',
			width: 50,
			items: [{
				iconCls: 'icon-delete',
				tooltip: 'Delete',
				handler: function(grid, rowIndex, colIndex, e) {
					var str = grid.getStore().getAt(rowIndex).get('fs_kode_brangkas');
					if (str) {
						Ext.MessageBox.show({
							title:'Delete record',
							msg: 'Would you like to delete?',
							buttons: Ext.Msg.YESNO,
							icon: Ext.Msg.QUESTION,
							fn: function(btn) {
								if (btn == "yes") {
									Ext.Ajax.request({
										url : 'masterpenyimpanan/remove/',
			            				params : {
											'fs_kode_brangkas': str
										},
										success: function(response) {
											var xtext = Ext.decode(response.responseText);
											Ext.MessageBox.show({
												buttons: Ext.MessageBox.OK,
												closable: false,
												icon: Ext.MessageBox.INFO,
												message: xtext.hasil,
												title: 'BPKB'
											});
											fnReset();
											grupMasterPenyimpananBPKB.load();  
										},
										failure: function(response) {
											var xtext = Ext.decode(response.responseText);
											Ext.MessageBox.show({
												buttons: Ext.MessageBox.OK,
												closable: false,
												icon: Ext.MessageBox.INFO,
												message: xtext.hasil,
												title: 'BPKB'
											});
										}
									});
								}
							}
						})	;
					}
				}
			}]
		}],
		bbar: Ext.create('Ext.PagingToolbar', {
			displayInfo: true,
			pageSize: 25,
			plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
			store: grupMasterPenyimpananBPKB
		}),
		tbar: [{
			flex: 1.4,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'Kode / Nama BPKB',
				id: 'txtCari',
				name: 'txtCari',
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
				grupMasterPenyimpananBPKB.load();
				}
			}]
		},{
			flex: 0.1,
			layout: 'anchor',
			xtype: 'container',
			items: []
		}],
		listeners: {
			itemdblclick: function(grid, record) {
				Ext.getCmp('txtKdCabang').setValue(record.get('fs_kode_cabang'));
				Ext.getCmp('cboCabang').setValue(record.get('fs_nama_cabang'));
				Ext.getCmp('txtKodeBrangkas').setValue(record.get('fs_kode_brangkas'));
				Ext.getCmp('txtNamaBrangkas').setValue(record.get('fs_nama_brangkas'));
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
		var grupSelect = Ext.create('Ext.data.Store', {
		autoLoad: true,
		fields: [
			'fs_kode_cabang','fs_kode_cabang'
		],
		proxy: {
			actionMethods: {
				read: 'POST'
			},
			reader: {
				type: 'json'
			},
			type: 'ajax',
			url: 'masterpeyimpananbpkb/select'
		}
	});

	// FUNCTIONS
	function fnReset() {
		// COMPONENT FORM Master Penyimpanan BPKB
		Ext.getCmp('cboCabang').setValue('');
		Ext.getCmp('txtKodeBrangkas').setValue('');
		Ext.getCmp('txtNamaBrangkas').setValue('')
	}

	function fnCekSave() {
		if (this.up('form').getForm().isValid()) {
			Ext.Ajax.on('beforerequest', fnMaskShow);
			Ext.Ajax.on('requestcomplete', fnMaskHide);
			Ext.Ajax.on('requestexception', fnMaskHide);

			Ext.Ajax.request({
				method: 'POST',
				url: 'masterpenyimpanan/ceksave',
				params: {
					'fs_kode_brangkas': Ext.getCmp('txtKodeBrangkas').getValue()
				},
				success: function(response) {
					var xtext = Ext.decode(response.responseText);
					if (xtext.sukses === false) {
						Ext.MessageBox.show({
							buttons: Ext.MessageBox.OK,
							closable: false,
							icon: Ext.MessageBox.INFO,
							msg: xtext.hasil,
							title: 'BPKB'
						});
					} else {
						Ext.MessageBox.show({
							buttons: Ext.MessageBox.YESNO,
							closable: false,
							icon: Ext.MessageBox.QUESTION,
							msg: xtext.hasil,
							title: 'BPKB',
							fn: function(btn) {
								if (btn == 'yes') {
									fnSave();
								}
							}
						});
					}
				},
				failure: function(response) {
					var xtext = Ext.decode(response.responseText);
					Ext.MessageBox.show({
						buttons: Ext.MessageBox.OK,
						closable: false,
						icon: Ext.MessageBox.INFO,
						msg: 'Simpan Gagal, Koneksi Gagal',
						title: 'BPKB'
					});
					fnMaskHide();
				}
			});
		}
	}
		
	function fnSave() {
		Ext.Ajax.on('beforerequest', fnMaskShow);
		Ext.Ajax.on('requestcomplete', fnMaskHide);
		Ext.Ajax.on('requestexception', fnMaskHide);

		Ext.Ajax.request({
			method: 'POST',
			url: 'masterpenyimpanan/save',
			params: {
				'fs_kode_cabang': Ext.getCmp('txtKdCabang').getValue(),
				'fs_kode_brangkas': Ext.getCmp('txtKodeBrangkas').getValue(),
				'fs_nama_brangkas': Ext.getCmp('txtNamaBrangkas').getValue()
			},
			success: function(response) {
				var xtext = Ext.decode(response.responseText);
				Ext.MessageBox.show({
					buttons: Ext.MessageBox.OK,
					closable: false,
					icon: Ext.MessageBox.INFO,
					msg: xtext.hasil,
					title: 'MFAS'
				});
				// REFRESH AFTER SAVE
				grupMasterPenyimpananBPKB.load();

				fnReset();
			},
			failure: function(response) {
				var xtext = Ext.decode(response.responseText);
				Ext.MessageBox.show({
					buttons: Ext.MessageBox.OK,
					closable: false,
					icon: Ext.MessageBox.INFO,
					msg: 'Saving Failed, Connection Failed!!',
					title: 'MFAS'
				});
				fnMaskHide();
			}
		});
	}

	function fnRemove() {

	}

	var frmMasterPeyimpanan = Ext.create('Ext.form.Panel', {
		border: false,
		frame: true,
		region: 'center',
		title: 'Master Penyimpanan BPKB',
		width: 970,
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
				title: 'Daftar Penyimpanan BPKB',
				xtype: 'form',
				items: [{
					fieldDefaults: {
						labelAlign: 'right',
						labelSeparator: '',
						labelWidth: 120,
						msgTarget: 'side'
					},	
					flex: 1,
					xtype: 'fieldset',
					title: 'Data Penyimpanan BPKB',
					style: 'padding: 5px;',
					items: [
						gridMasterPenyimpananBPKB
					]
				}]
			},{
				id: 'tab2',
				bodyStyle: 'background-color: '.concat(gBasePanel),
				border: false,
				frame: false,
				title: 'Form Penyimpanan BPKB',
				xtype: 'form',
				items: [{
					fieldDefaults: {
						labelAlign: 'right',
						labelSeparator: '',
						labelWidth: 140,
						msgTarget: 'side'
					},	
					xtype: 'fieldset',
					border: false,
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
								title: 'Master Penyimpanan BPKB',
								style: 'padding: 5px;',
								xtype: 'fieldset',
								items: [
									cboCabang,
									txtKdCabang,
									txtKodeBrangkas,
									txtNamaBrangkas

								]
						},{
						anchor: '100%',
						layout: 'hbox',
						xtype: 'container',
						items: [{
							flex: 1,
							layout: 'anchor',
							xtype: 'container',
							items: []
					},{
								flex: 1,
								layout: 'anchor',
								xtype: 'container',
								items: [
									btnSave
								]
					},{
								flex: 1,
								layout: 'anchor',
								xtype: 'container',
								items: [
									btnReset
								]		
							}]
						}]	
					},{
							flex: 1,
							layout: 'anchor',
							xtype: 'container',
							items: [{
								title: 'Penyimpanan BPKB',
								style: 'padding: 5px;',
								xtype: 'fieldset',
								items: [
								gridMasterPenyimpanan
								]
					
							}]
						}]
					}]
				}]
				
			}]		
		}]	
	});			


	var vMask = new Ext.LoadMask({
		msg: 'Please wait...',
		target: frmMasterPeyimpanan
	});

	function fnMaskShow() {
		frmMasterPeyimpanan.mask('Please wait...');
	}

	function fnMaskHide() {
		frmMasterPeyimpanan.unmask();
	}
	
	frmMasterPeyimpanan.render(Ext.getBody());
	Ext.get('loading').destroy();
});