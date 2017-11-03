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

	Ext.define('DataGridPemeriksa', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_kode_cabang', type: 'string'},
			{name: 'fs_kode_pemeriksa', type: 'string'},
			{name: 'fs_nama_pemeriksa', type: 'string'},
		]
	});

	var grupPemeriksa = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridPemeriksa',
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
			url: 'masterbpkb/grid'
		},
		listeners: {
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
			url: 'masterbpkb/gridcabang'
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


	// COMPONENT FORM MASTER BPKB
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

	var txtKdCabang = {
		id: 'txtKdCabang',
		name: 'txtKdCabang',
		xtype: 'textfield',
		hidden: true
	};

	var txtKodePemeriksa = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Kode Pemeriksa',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtKodePemeriksa',
		name: 'txtKodePemeriksa',
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

	var txtNamaPemeriksa = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Nama Pemeriksa',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNamaPemeriksa',
		name: 'txtNamaPemeriksa',
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

	// GRID
	var gridDataMasterBPKB = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 350,
		sortableColumns: false,
		store: grupPemeriksa,
		columns: [{
			xtype: 'rownumberer',
			width: 25
		},{
			text: 'Kode Cabang',
			dataIndex: 'fs_kode_cabang',
			menuDisabled: true,
			hidden: true
		},{
			flex: 1,
			text: 'Cabang',
			dataIndex: 'fs_nama_cabang',
			menuDisabled: true,
			width: 100
		},{
			flex: 1,
			text: 'Kode Pemeriksa',
			dataIndex: 'fs_kode_pemeriksa',
			menuDisabled: true,
			width: 100
		},{
			flex: 1,
			text: 'Nama Pemeriksa',
			dataIndex: 'fs_nama_pemeriksa',
			menuDisabled: true,
			width: 100			
		},{
			xtype:'actioncolumn',
			width: 50,
			items: [{
				iconCls: 'icon-delete',
				tooltip: 'Delete',
				handler: function(grid, rowIndex, colIndex, e) {
					var str = grid.getStore().getAt(rowIndex).get('fs_kode_pemeriksa');
					if (str) {
						Ext.MessageBox.show({
							title:'Menghapus Data',
							msg: 'Apakah Anda ingin menghapus?',
							buttons: Ext.Msg.YESNO,
							icon: Ext.Msg.QUESTION,
							fn: function(btn) {
								if (btn == "yes") {
									Ext.Ajax.request({
										url : 'masterbpkb/remove/',
			            				params : {
											'fs_kode_pemeriksa': str
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
											grupPemeriksa.load();  
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
						});
					}
				}
			}]
		}],
		bbar: Ext.create('Ext.PagingToolbar', {
			displayInfo: true,
			pageSize: 25,
			plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
			store: grupPemeriksa
		}),
		tbar: [{
			flex: 1.4,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'Kode / Kode Pemeriksa / Nama Pemeriksa',
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
					grupPemeriksa.load();
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
				Ext.getCmp('txtKodePemeriksa').setValue(record.get('fs_kode_pemeriksa'));
				Ext.getCmp('txtNamaPemeriksa').setValue(record.get('fs_nama_pemeriksa'));
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

	// FUNCTIONS
	function fnReset() {
		Ext.getCmp('cboCabang').setValue('');
		Ext.getCmp('txtKodePemeriksa').setValue('');
		Ext.getCmp('txtNamaPemeriksa').setValue('');
	}

	function fnCekSave() {
		if (this.up('form').getForm().isValid()) {
			Ext.Ajax.on('beforerequest', fnMaskShow);
			Ext.Ajax.on('requestcomplete', fnMaskHide);
			Ext.Ajax.on('requestexception', fnMaskHide);

			Ext.Ajax.request({
				method: 'POST',
				url: 'masterbpkb/ceksave',
				params: {
					'fs_kode_pemeriksa': Ext.getCmp('txtKodePemeriksa').getValue()
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
			url: 'masterbpkb/save',
			params: {
				'fs_kode_cabang': Ext.getCmp('txtKdCabang').getValue(),
				'fs_kode_pemeriksa': Ext.getCmp('txtKodePemeriksa').getValue(),
				'fs_nama_pemeriksa': Ext.getCmp('txtNamaPemeriksa').getValue()
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
				grupPemeriksa.load();

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

	var frmMasterBPKB = Ext.create('Ext.form.Panel', {
		border: false,
		frame: true,
		region: 'center',
		title: 'Master BPKB',
		width: 900,
		items: [{
			bodyStyle: 'background-color: '.concat(gBasePanel),
			border: false,
			frame: false,
			xtype: 'form',
			items: [{
				fieldDefaults: {
					labelAlign: 'right',
					labelSeparator: '',
					labelWidth: 120,
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
							items: []
					},{
						flex: 2,
						layout: 'anchor',
						xtype: 'container',
						items: [{
							anchor: '98%',
							style: 'padding: 5px;',
							title: 'Master Pemeriksa BPKB',
							xtype: 'fieldset',
							items: [
								cboCabang,
								txtKdCabang,
								txtKodePemeriksa,
								txtNamaPemeriksa
							]
						}]
					},{
						flex: 1,
						layout: 'anchor',
						xtype: 'container',
						items: []

						}]
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
							flex: 0.5,
							layout: 'anchor',
							xtype: 'container',
							items: [
								btnSave
							]
					},{
							flex: 0.5,
							layout: 'anchor',
							xtype: 'container',
							items: [
								btnReset
							]
					},{
							flex: 1,
							layout: 'anchor',
							xtype: 'container',
							items: []
							
						}]
					},{
							flex: 1,
							layout: 'anchor',
							xtype: 'container',
							items: [{

							style: 'padding: 5px;',
							title: 'Cart Pemeriksa',
							xtype: 'fieldset',
							items: [
								gridDataMasterBPKB
							]
						},{
							flex: 1,
							layout: 'anchor',
							xtype: 'container',
							items: []
						}]
					}]
				}]
			}]
		});

	var vMask = new Ext.LoadMask({
		msg: 'Please wait...',
		target: frmMasterBPKB
	});

	function fnMaskShow() {
		frmMasterBPKB.mask('Please wait...');
	}

	function fnMaskHide() {
		frmMasterBPKB.unmask();
	}
	
	frmMasterBPKB.render(Ext.getBody());
	Ext.get('loading').destroy();
});