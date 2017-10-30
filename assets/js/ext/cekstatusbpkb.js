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

	Ext.define('DataGridCekBPKB', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_nama', type: 'string'},
			{name: 'fs_no_polisi', type: 'string'},
			{name: 'fs_no_BPKP', type: 'string'},
			{name: 'fs_nama_BPKB', type: 'string'}

		]
	});

	var grupDataCekBPKB = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridCekBPKB',
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
			url: 'cekstatusbpkb/grid'
		},listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari').getValue()
				});
			}
		}		
	});

	var gridStatusBPKB = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 400,
		region: 'center',
		sortableColumns: false,
		store: '',
		columns: [{
			xtype: 'rownumberer',
			width: 50
		},{
			text: 'Nama',
			dataIndex: 'fs_nama',
			menuDisabled: true,
			width: 200
		},{
			text: 'No. Polisi',
			dataIndex: 'fs_no_polisi	',
			menuDisabled: true,
			width: 100
		},{
			text: 'No. BPKB',
			dataIndex: 'fs_no_BPKP',
			menuDisabled: true,
			width: 100
		},{
			text: 'Nama BPKB',
			dataIndex: 'fs_nama_BPKB',
			menuDisabled: true,
			width: 200	
		},{
			text: 'No. Transaksi',
			dataIndex: 'fs_no_transaksi',
			menuDisabled: true,
			width: 100	
		},{
			xtype:'actioncolumn',
			width: 200,
			items: [{
				iconCls: 'icon-delete',
				tooltip: 'Delete',
				handler: function(grid, rowIndex, colIndex, e) {
					var str = grid.getStore().getAt(rowIndex).get('fs_nama');
					if (str) {
						Ext.MessageBox.show({
							title:'Delete record',
							msg: 'Would you like to delete?',
							buttons: Ext.Msg.YESNO,
							icon: Ext.Msg.QUESTION,
							fn: function(btn) {
								if (btn == "yes") {
									Ext.Ajax.request({
										url : 'cekstatusbpkb/remove/',
			            				params : {
											'fs_nama': str
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
											grupDataBPKB.load();  
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
			store: ''
		}),
		tbar: [{
			flex: 1.4,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'Nama Konsumen',
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
				grupDataBPKB.load();
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
				Ext.getCmp('txtNama').setValue(record.get('fs_nama'));
				Ext.getCmp('txtNoPolisi').setValue(record.get('fs_no_polisi'));
				Ext.getCmp('txtNoBPKB').setValue(record.get('fs_no_BPKP'));
				Ext.getCmp('txtNamaBPKB').setValue(record.get('fs_nama_BPKB'));
				Ext.getCmp('txtNoTransaksi').setValue(record.get('fs_no_transaksi'));
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
	// COMPONENT FORM DATA KONSUMEN & KENDARAAN
	var txtNama = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Nama',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNama',
		name: 'txtNama',
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

	var txtNoPolisi = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'No. Polisi',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNoPolisi',
		name: 'txtNoPolisi',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 8,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtNoRangka = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'No. Rangka',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNoRangka',
		name: 'txtNoRangka',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 17,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtNoMesin = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'No. Mesin',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNoMesin',
		name: 'txtNoMesin',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 17,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtNoBPKB = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'No. BPKB',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNoBPKB',
		name: 'txtNoBPKB',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 17,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtNamaBPKB = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Nama BPKB',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNamaBPKB',
		name: 'txtNamaBPKB',
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

	var cboTglBPKB = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		editable: true,
		fieldLabel: 'Tanggal.BPKB',
		format: 'd-m-Y',
		id: 'cboTglBPKB',
		name: 'cboTglBPKB',
		maskRe: /[0-9-]/,
		minValue: Ext.Date.add(new Date(), Ext.Date.YEAR, -75),
		xtype: 'datefield',
		value: new Date()
	};

	var txtSilinder = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Silinder',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtSilinder',
		name: 'txtSilinder',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 6,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtJenisKendaraan = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Jenis Kend.',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtJenisKendaraan',
		name: 'txtJenisKendaraan',
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

	var txtWarna = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Warna.',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtWarna',
		name: 'txtWarna',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 10,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtTahun = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Tahun',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtTahun',
		name: 'txtTahun',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 4,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	// COMPONENT FORM DATA AR
	var txtNoPJJ = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'NO. PJJ',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNoPJJ',
		name: 'txtNoPJJ',
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

	var cboTglCair = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		editable: true,
		fieldLabel: 'Tanggal Cair',
		format: 'd-m-Y',
		id: 'cboTglCair',
		name: 'cboTglCair',
		maskRe: /[0-9-]/,
		minValue: Ext.Date.add(new Date(), Ext.Date.YEAR, -75),
		xtype: 'datefield',
		value: new Date()
	};

	var txtAngsuran = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Angsuran Ke',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtAngsuran',
		name: 'txtAngsuran',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 5,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtStatus = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Status',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtStatus',
		name: 'txtStatus',
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

	// COMPONENT FORM DATA AP

	var txtKreditur = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Kreditur',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtKreditur',
		name: 'txtKreditur',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 10,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var cboTglCair1 = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		editable: true,
		fieldLabel: 'Tanggal Cair',
		format: 'd-m-Y',
		id: 'cboTglCair1',
		name: 'cboTglCair1',
		maskRe: /[0-9-]/,
		minValue: Ext.Date.add(new Date(), Ext.Date.YEAR, -75),
		xtype: 'datefield',
		value: new Date()
	};

	var txtNoRPPD = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'No. RPPD',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNoRPPD',
		name: 'txtNoRPPD',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 13,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtTenor = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Tenor',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtTenor',
		name: 'txtTenor',
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

	var txtStatus1 = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Status',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtStatus1',
		name: 'txtStatus1',
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

	var txtAngsuran1 = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Angsuran Ke',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtAngsuran1',
		name: 'txtAngsuran1',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 5,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	// COMPONENT DATA TRANSAKSI
	var txtNoTransaksi = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'No. Transaksi',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNoTransaksi',
		name: 'txtNoTransaksi',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 10,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtNoFaktur = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'No. Faktur',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNoFaktur',
		name: 'txtNoFaktur',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 10,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtNoBatch1 = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'No. Batch',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNoBatch1',
		name: 'txtNoBatch1',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 10,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtKonfirmasi = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Konfirmasi',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtKonfirmasi',
		name: 'txtKonfirmasi',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 10,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	// FUNCTIONS
	function fnReset() {
		// COMPONENT FORM DATA KONSUMEN & KENDARAAN
		Ext.getCmp('txtNama').setValue('');
		Ext.getCmp('txtNoPolisi').setValue('');
		Ext.getCmp('txtNoRangka').setValue('');
		Ext.getCmp('txtNoMesin').setValue('');
		Ext.getCmp('txtNoBPKB').setValue('');
		Ext.getCmp('txtNamaBPKB').setValue('');
		Ext.getCmp('cboTglBPKB').setValue('');
		Ext.getCmp('txtSilinder').setValue('');
		Ext.getCmp('txtJenisKendaraan').setValue('');
		Ext.getCmp('txtWarna').setValue('');
		Ext.getCmp('txtTahun').setValue('');	
		// COMPONENT FORM DATA AR
		Ext.getCmp('txtNoPJJ').setValue('');
		Ext.getCmp('cboTglCair').setValue('');
		Ext.getCmp('txtAngsuran').setValue('');
		Ext.getCmp('txtStatus').setValue('');
		// COMPONENT FORM DATA AP
		Ext.getCmp('txtKreditur').setValue('');
		Ext.getCmp('cboTglCair1').setValue('');
		Ext.getCmp('txtNoRPPD').setValue('');
		Ext.getCmp('txtStatus1').setValue('');
		Ext.getCmp('txtTenor').setValue('');
		Ext.getCmp('txtAngsuran1').setValue('');
		// COMPONENT FORM DATA TRANSAKSI
		Ext.getCmp('txtNoTransaksi').setValue('');
		Ext.getCmp('txtNoFaktur').setValue('');
		Ext.getCmp('txtNoBatch1').setValue('');
		Ext.getCmp('txtKonfirmasi').setValue('');
	}
								
	function fnCekSave() {

	}
		
	function fnSave() {

	}

	function fnRemove() {

	}

	var frmCekStatusBPKB = Ext.create('Ext.form.Panel', {
		border: false,
		frame: true,
		region: 'center',
		title: 'Cek Status BPKB',
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
				title: 'Daftar Status BPKB',
				xtype: 'form',
				items: [{
					fieldDefaults: {
						labelAlign: 'right',
						labelSeparator: '',
						labelWidth: 140,
						msgTarget: 'side'
					},	
					xtype: 'fieldset',
					title: 'Data Status BPKB',
					style: 'padding: 5px;',
					items: [
						gridStatusBPKB
					]
				}]
			},{
				id: 'tab2',
				bodyStyle: 'background-color: '.concat(gBasePanel),
				border: false,
				frame: false,
				title: 'Form Cek Status BPKB',
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
								title: 'Data Konsumen dan Kendaraan',
								style: 'padding: 5px;',
								xtype: 'fieldset',
								items: [
									txtNama,
									txtNoPolisi,
									txtNoRangka,
									txtNoMesin,
									txtNoBPKB,
									txtNamaBPKB,
									cboTglBPKB,
									txtSilinder,
									txtJenisKendaraan,
									txtWarna,
									txtTahun
								]
							}]
						},{
							flex: 1,
							layout: 'anchor',
							xtype: 'container',
							items: [{
								anchor: '98%',
								title: 'Data AR',
								style: 'padding: 5px;',
								xtype: 'fieldset',
								items: [
									txtNoPJJ,
									cboTglCair,
									txtAngsuran,
									txtStatus
								]
							},{
								anchor: '98%',
								title: 'Data AP',
								style: 'padding: 5px;',
								xtype: 'fieldset',
								items: [
									txtKreditur,
									cboTglCair1,
									txtNoRPPD,
									txtStatus1,
									txtTenor,
									txtAngsuran1
								]
							},{
								anchor: '98%',
								title: 'Data Transaksi',
								style: 'padding: 5px;',
								xtype: 'fieldset',
								items: [
									txtNoTransaksi,
									txtNoFaktur,
									txtNoBatch1,
									txtKonfirmasi
								]
							}]
						}]
					}]
				}],
				buttons: [{
					iconCls: 'icon-save',
					id: 'btnSave',
					name: 'btnSave',
					text: 'Save',
					scale: 'medium',
					handler: fnCekSave
				},{
					iconCls: 'icon-reset',
					text: 'Reset',
					scale: 'medium',
					handler: fnReset
				}]
			}]		
		}]	
	});

	var vMask = new Ext.LoadMask({
		msg: 'Please wait...',
		target: frmCekStatusBPKB
	});

	function fnMaskShow() {
		frmCekStatusBPKB.mask('Please wait...');
	}

	function fnMaskHide() {
		frmCekStatusBPKB.unmask();
	}
	
	frmCekStatusBPKB.render(Ext.getBody());
	Ext.get('loading').destroy();
});