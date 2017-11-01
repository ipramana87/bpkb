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

	Ext.define('DataGridFasilitas', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fd_tgl_fasilitas', type: 'string'},
			{name: 'fs_nama_fasilitas', type: 'string'},
			{name: 'fs_plafon', type: 'string'},
		]
	});

	Ext.define('DataGridKreditur', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_kode_kreditur', type: 'string'},
			{name: 'fs_nama_kreditur', type: 'string'},
			{name: 'fs_aktif', type: 'string'},
		]
	});

	var grupDataKreditur = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridKreditur',
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
			url: 'masterkreditur/grid'
		},listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari').getValue()
				});
			}
		}		
	});

	var grupMasterFasilitas = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridFasilitas',
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
			url: 'masterkreditur/gridfasilitas'
		},listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari').getValue()
				});
			}
		}		
	});

	var grupAktif = Ext.create('Ext.data.Store', {
		autoLoad: true,
		fields: [
			'fs_kode','fs_nama'
		],
		proxy: {
			actionMethods: {
				read: 'POST'
			},
			reader: {
				type: 'json'
			},
			type: 'ajax',
			url: 'masterkreditur/combo'
		}
	});

	// COMPONENT FORM MASTER KREDITUR
	var txtKodeKreditur = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Kode Kreditur',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtKodeKreditur',
		name: 'txtKodeKreditur',
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

	var txtNamaKreditur = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Nama Kreditur',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNamaKreditur',
		name: 'txtNamaKreditur',
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

	var cboAktif = {
		anchor: '100%',
		displayField: 'fs_nama',
		editable: false,
		fieldLabel: 'Aktif',
		id: 'cboAktif',
		name: 'cboAktif',
		store: grupAktif,
		valueField: 'fs_kode',
		xtype: 'combobox'
	};

	var cboTglKreditur = {
		anchor: '98%',
		editable: true,
		labelAlign: 'top',
		fieldLabel: 'Tanggal',
		format: 'd-m-Y',
		id: 'cboTglKreditur',
		name: 'cboTglKreditur',
		maskRe: /[0-9-]/,
		minValue: Ext.Date.add(new Date(), Ext.Date.YEAR, -75),
		xtype: 'datefield',
		value: new Date()
	};

	var txtNamaFasilitas = {
		anchor: '98%',
		labelAlign: 'top',
		fieldLabel: 'Nama Fasilitas',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNamaFasilitas',
		name: 'txtNamaFasilitas',
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

	var txtPlafon = {
		anchor: '98%',
		labelAlign: 'top',
		fieldLabel: 'Plafon',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtPlafon',
		name: 'txtPlafon',
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

	// GRID Mater Fasilitas
	var gridMasterFasilitas = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 500,
		sortableColumns: false,
		store: grupMasterFasilitas,
		columns: [{
			xtype: 'rownumberer',
			width: 45
		},{
			text: 'Tanggal ',
			dataIndex: 'fd_tgl_fasilitas',
			menuDisabled: true,
			width: 80,
			renderer: Ext.util.Format.dateRenderer('d-m-Y')
		},{
			text: 'Nama Fasilitas',
			dataIndex: 'fs_nama_fasilitas',
			menuDisabled: true,
			width: 80
		},{
			text: 'Plafon',
			dataIndex: 'fs_plafon',
			menuDisabled: true,
			width: 270
		}],
		tbar: [{
			flex: 1,
			layout: 'anchor',
			xtype: 'container',
			items: [
				cboTglKreditur
			]
		},{
			flex: 2,
			layout: 'anchor',
			xtype: 'container',
			items: [
				txtNamaFasilitas
			]
		},{
			flex:1,
			layout: 'anchor',
			xtype: 'container',
			items: [
				txtPlafon
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
					var total = grupMasterFasilitas.getCount();

					var data = Ext.create('DataGridFasilitas', {
						fd_tgl_fasilitas: Ext.getCmp('cboTglKreditur').getValue(),
						fs_nama_fasilitas: Ext.getCmp('txtNamaFasilitas').getValue(),
						fs_plafon: Ext.getCmp('txtPlafon').getValue()
					});

					var tanggal = Ext.getCmp('cboTglKreditur').getValue();
					if (tanggal === '') {
						Ext.MessageBox.show({
							buttons: Ext.MessageBox.OK,
							closable: false,
							icon: Ext.Msg.WARNING,
							msg: 'Tanggal, belum diisi',
							title: 'MFAS'
						});
						return;
					}

					var nama_fasilitas = Ext.getCmp('txtNamaFasilitas').getValue();
					if (nama_fasilitas === '') {
						Ext.MessageBox.show({
							buttons: Ext.MessageBox.OK,
							closable: false,
							icon: Ext.Msg.WARNING,
							msg: 'Nama Fasilitas, belum diisi',
							title: 'MFAS'
						});
						return;
					}

					var plafon = Ext.getCmp('txtPlafon').getValue();
					if (plafon === '') {
						Ext.MessageBox.show({
							buttons: Ext.MessageBox.OK,
							closable: false,
							icon: Ext.Msg.WARNING,
							msg: 'Plafon, belum diisi',
							title: 'Plafon'
						});
						return;
					}

					grupMasterFasilitas.insert(total, data);

					Ext.getCmp('cboTglKreditur').setValue('');
					Ext.getCmp('txtNamaFasilitas').setValue('');
					Ext.getCmp('txtPlafon').setValue('');

					total = grupMasterFasilitas.getCount() - 1;
					gridMasterFasilitas.getSelectionModel().select(total);
				}
			},{
				iconCls: 'icon-delete',
				itemId: 'removeData',
				text: 'Delete',
				handler: function() {

					var sm = gridMasterFasilitas.getSelectionModel();
					grupMasterFasilitas.remove(sm.getSelection());
					gridMasterFasilitas.getView().refresh();

					if (grupMasterFasilitas.getCount() > 0) {
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
			store: grupMasterFasilitas
		}),
		listeners: {
			selectionchange: function(view, records) {
				gridMasterFasilitas.down('#removeData').setDisabled(!records.length);
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

	var gridDataKreditur = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 450,
		sortableColumns: false,
		store: grupDataKreditur,
		columns: [{
			xtype: 'rownumberer',
			width: 25
		},{
			flex: 0.5,
			text: 'Kode Kreditur',
			dataIndex: 'fs_kode_kreditur',
			menuDisabled: true,
			width: 100
		},{
			flex: 0.5,
			text: 'Nama Kreditur',
			dataIndex: 'fs_nama_kreditur',
			menuDisabled: true,
			width: 100
		},{
			text: 'Combo Aktif',
			dataIndex: 'fs_aktif',
			menuDisabled: true,
			hidden: true

		},{
			xtype:'actioncolumn',
			width: 50,
			items: [{
				iconCls: 'icon-delete',
				tooltip: 'Delete',
				handler: function(grid, rowIndex, colIndex, e) {
					var str = grid.getStore().getAt(rowIndex).get('fs_kode_kreditur');
					if (str) {
						Ext.MessageBox.show({
							title:'Delete record',
							msg: 'Would you like to delete?',
							buttons: Ext.Msg.YESNO,
							icon: Ext.Msg.QUESTION,
							fn: function(btn) {
								if (btn == "yes") {
									Ext.Ajax.request({
										url : 'masterkreditur/remove/',
			            				params : {
											'fs_kode_kreditur': str
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
											grupDataKreditur.load();  
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
			store: grupDataKreditur
		}),
		tbar: [{
			flex: 1.4,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'Kode / Nama Kreditur',
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
				grupDataKreditur.load();
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
				Ext.getCmp('txtKodeKreditur').setValue(record.get('fs_kode_kreditur'));
				Ext.getCmp('txtNamaKreditur').setValue(record.get('fs_nama_kreditur'));
				Ext.getCmp('cboAktif').setValue(record.get('fs_aktif'));
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
			'fs_kode_kreditur','fs_kode_kreditur'
		],
		proxy: {
			actionMethods: {
				read: 'POST'
			},
			reader: {
				type: 'json'
			},
			type: 'ajax',
			url: 'masterkreditur/select'
		}
	});

	// FUNCTIONS
	function fnReset() {
		// COMPONENT FORM Master Kreditur
		Ext.getCmp('txtKodeKreditur').setValue('');
		Ext.getCmp('txtNamaKreditur').setValue('');
		Ext.getCmp('cboAktif').setValue('');
	}

	function fnCekSave() {
		if (this.up('form').getForm().isValid()) {
			Ext.Ajax.on('beforerequest', fnMaskShow);
			Ext.Ajax.on('requestcomplete', fnMaskHide);
			Ext.Ajax.on('requestexception', fnMaskHide);

			Ext.Ajax.request({
				method: 'POST',
				url: 'masterkreditur/ceksave',
				params: {
					'fs_kode_kreditur': Ext.getCmp('txtKodeKreditur').getValue()
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
			url: 'masterkreditur/save',
			params: {
				'fs_kode_kreditur': Ext.getCmp('txtKodeKreditur').getValue(),
				'fs_nama_kreditur': Ext.getCmp('txtNamaKreditur').getValue(),
				'fs_aktif': Ext.getCmp('cboAktif').getValue()
			},
			success: function(response) {
				var xtext = Ext.decode(response.responseText);
				Ext.MessageBox.show({
					buttons: Ext.MessageBox.OK,
					closable: false,
					icon: Ext.MessageBox.INFO,
					msg: xtext.hasil,
					title: 'BPKB'
				});
				// REFRESH AFTER SAVE
				grupDataKreditur.load();

				fnReset();
			},
			failure: function(response) {
				var xtext = Ext.decode(response.responseText);
				Ext.MessageBox.show({
					buttons: Ext.MessageBox.OK,
					closable: false,
					icon: Ext.MessageBox.INFO,
					msg: 'Saving Failed, Connection Failed!!',
					title: 'BPKB'
				});
				fnMaskHide();
			}
		});
	}

	function fnRemove() {

	}

	var frmMasterKreditur = Ext.create('Ext.form.Panel', {
		border: false,
		frame: true,
		region: 'center',
		title: 'Master Kreditur',
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
				title: 'Daftar Kreditur',
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
					title: 'Data Kreditur',
					style: 'padding: 5px;',
					items: [
						gridDataKreditur
					]
				}]
			},{
				id: 'tab2',
				bodyStyle: 'background-color: '.concat(gBasePanel),
				border: false,
				frame: false,
				title: 'Form Kreditur',
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
								title: 'Master Kreditur',
								style: 'padding: 5px;',
								xtype: 'fieldset',
								items: [
									txtKodeKreditur,
									txtNamaKreditur,
									cboAktif

								]
						},{
						anchor: '100%',
						layout: 'hbox',
						xtype: 'container',
						items: [{
							flex: 2.2,
							layout: 'anchor',
							xtype: 'container',
							items: []
					},{
								flex: 2,
								layout: 'anchor',
								xtype: 'container',
								items: [
									btnSave
								]
					},{
								flex: 2,
								layout: 'anchor',
								xtype: 'container',
								items: [
									btnReset
								]		
							}]
						}]	
					},{
							flex: 1.5,
							layout: 'anchor',
							xtype: 'container',
							items: [{
								title: 'Fasilitas',
								style: 'padding: 5px;',
								xtype: 'fieldset',
								items: [
								gridMasterFasilitas
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
		target: frmMasterKreditur
	});

	function fnMaskShow() {
		frmMasterKreditur.mask('Please wait...');
	}

	function fnMaskHide() {
		frmMasterKreditur.unmask();
	}
	
	frmMasterKreditur.render(Ext.getBody());
	Ext.get('loading').destroy();
});