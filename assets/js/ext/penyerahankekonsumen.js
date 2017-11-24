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

	Ext.define('DataGridHistory', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fd_tgl_serah', type: 'string'},
			{name: 'fs_no_pjj', type: 'string'},
			{name: 'fs_nama_pemilik', type: 'string'},
			{name: 'fs_no_bpkb', type: 'string'},
			{name: 'fs_pic', type: 'string'}
		]
	});

	var grupHistory = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridHistory',
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
			url: 'Penyerahankekonsumen/gridpenyerahan'
		},listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari1').getValue()
				});
			}
		}		
	});

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
			url: 'Penyerahankekonsumen/griddaftrabpkb'
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
				Ext.getCmp('txtNoPJJ').setValue(record.get('fn_no_pjj'));
				Ext.getCmp('txtNamaKonsumen').setValue(record.get('fs_nama_pemilik'));
				Ext.getCmp('txtJenisKendaraan').setValue(record.get('fs_jenis_kendaraan'));
				Ext.getCmp('txtTahunKendaraan').setValue(record.get('fn_tahun_kendaraan'));
				Ext.getCmp('txtWarnaKendaraan').setValue(record.get('fs_warna_kendaraan'));
				Ext.getCmp('txtNomerMesin').setValue(record.get('fs_no_mesin'));
				Ext.getCmp('txtNomerRangka').setValue(record.get('fs_no_rangka'));
				Ext.getCmp('txtNoPolisi').setValue(record.get('fs_no_polisi'));
				Ext.getCmp('txtNoBPKB').setValue(record.get('fs_no_bpkb'));
				Ext.getCmp('txtNoFaktur').setValue(record.get('fs_no_faktur'));
				Ext.getCmp('txtNoPJJ1').setValue(record.get('fn_no_pjj'));
				Ext.getCmp('txtNamaKonsumen1').setValue(record.get('fs_nama_pemilik'));
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

	// GRID HISTORY
	var gridHistory = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 400,
		sortableColumns: false,
		store: grupHistory,
		columns: [{
			xtype: 'rownumberer',
			width: 25
		},{
			text: 'Tanggal Serah',
			dataIndex: 'fd_tgl_serah',
			menuDisabled: true,
			width: 200
		},{
			text: 'No. PJJ',
			dataIndex: 'fs_no_pjj',
			menuDisabled: true,
			width: 200
		},{
			text: 'Nama Konsumen',
			dataIndex: 'fs_nama_pemilik',
			menuDisabled: true,
			width: 200
		},{
			text: 'No. BPKB',
			dataIndex: 'fs_no_bpkb',
			menuDisabled: true,
			width: 200
		},{
			text: 'PIC',
			dataIndex: 'fs_pic',
			menuDisabled: true,
			width: 200
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
				grupHistory.load();
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

	// COMPONENT FORM STATUS KONSUMEN
	var txtNoPJJ1 = {
		anchor: '100%',
		fieldLabel: 'No. PJJ',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNoPJJ1',
		name: 'txtNoPJJ1',
		xtype: 'textfield'
	};

	var txtNamaKonsumen1 = {
		anchor: '100%',
		fieldLabel: 'Nama Konsumen',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNamaKonsumen1',
		name: 'txtNamaKonsumen1',
		xtype: 'textfield'
	};

	var txtpiutang = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'O/S Piutang',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtpiutang',
		name: 'txtpiutang',
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

	var txtpokok = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'O/S Pokok',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtpokok',
		name: 'txtpokok',
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

	var txtdenda = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'O/S Denda',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtdenda',
		name: 'txttxtdendapokok',
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

	// COMPONENT FORM DETAIL BPKB
	var cboNoBPKB = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'No. BPKB',
		emptyText: 'No. BPKB',
		fieldStyle: 'text-transform: uppercase;',
		id: 'cboNoBPKB',
		name: 'cboNoBPKB',
		xtype: 'textfield',
		triggers: {
			reset: {
				cls: 'x-form-clear-trigger',
				handler: function(field) {
					field.setValue('');
					Ext.getCmp('').setValue('');
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

	var txtNoBPKB = {
		anchor: '100%',
		fieldLabel: 'No. BPKB',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNoBPKB',
		name: 'txtNoBPKB',
		xtype: 'textfield'
	};

	var txtNoPJJ = {
		anchor: '100%',
		fieldLabel: 'No. PJJ',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNoPJJ',
		name: 'txtNoPJJ',
		xtype: 'textfield'
	};

	var txtNamaKonsumen = {
		anchor: '100%',
		fieldLabel: 'Nama Konsumen',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNamaKonsumen',
		name: 'txtNamaKonsumen',
		xtype: 'textfield'
	};

	var cboTglBPKB = {
		anchor: '100%',
		editable: false,
		fieldLabel: 'Tanggal BPKB',
		format: 'd-m-Y',
		id: 'cboTglBPKB',
		name: 'cboTglBPKB',
		maskRe: /[0-9-]/,
		xtype: 'datefield'
	};

	var txtJenisKendaraan = {
		anchor: '100%',
		fieldLabel: 'Jenis Kendaraan',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtJenisKendaraan',
		name: 'txtJenisKendaraan',
		xtype: 'textfield'
	};

	var txtTahunKendaraan = {
		anchor: '100%',
		fieldLabel: 'Tahun Kendaraan',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtTahunKendaraan',
		name: 'txtTahunKendaraan',
		xtype: 'textfield'
	};

	var txtWarnaKendaraan = {
		anchor: '100%',
		fieldLabel: 'Warna Kendaraan',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtWarnaKendaraan',
		name: 'txtWarnaKendaraan',
		xtype: 'textfield'
	};

	var txtNomerRangka = {
		anchor: '100%',
		fieldLabel: 'Nomer Rangka',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNomerRangka',
		name: 'txtNomerRangka',
		xtype: 'textfield'
	};

	var txtNomerMesin = {
		anchor: '100%',
		fieldLabel: 'Nomer Mesin',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNomerMesin',
		name: 'txtNomerMesin',
		xtype: 'textfield'
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

	var cboTglTerbit = {
		anchor: '98%',
		editable: true,
		fieldLabel: 'Tgl Terbit BPKB',
		format: 'd-m-Y',
		id: 'cboTglTerbit',
		name: 'cboTglTerbit',
		maskRe: /[0-9-]/,
		minValue: Ext.Date.add(new Date(), Ext.Date.YEAR, -75),
		xtype: 'datefield',
		value: new Date()
	}

	var cboTglTerbitSTNK = {
		anchor: '98%',
		editable: true,
		fieldLabel: 'Tgl Terbit STNK',
		format: 'd-m-Y',
		id: 'cboTglTerbitSTNK',
		name: 'cboTglTerbitSTNK',
		maskRe: /[0-9-]/,
		minValue: Ext.Date.add(new Date(), Ext.Date.YEAR, -75),
		xtype: 'datefield',
		value: new Date()
	}

	var btnOK = {
		anchor: '100%',
		scale: 'medium',
		xtype: 'button',
		id: 'btnOK',
		name: 'btnOK',
		text: 'Serah',
		iconCls: 'icon-save',
		handler: ''
	};

	var btnKirim = {
		anchor: '100%',
		scale: 'medium',
		xtype: 'button',
		id: 'btnKirim',
		name: 'btnKirim',
		text: 'Kirim',
		iconCls: 'icon-save',
		handler: ''
	};

	var txtNoFaktur = {
		anchor: '100%',
		fieldLabel: 'No. Faktur',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNoFaktur',
		name: 'txtNoFaktur',
		xtype: 'textfield'
	};

	var txtNoTempatBPKB = {
		anchor: '100%',
		fieldLabel: 'Tempat BPKB',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNoTempatBPKB',
		name: 'txtNoTempatBPKB',
		xtype: 'textfield'
	};

	var txtNoLoker = {
		anchor: '100%',
		fieldLabel: 'Loker',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNoLoker',
		name: 'txtNoLoker',
		xtype: 'textfield'
	};

	var frmPenyerahanKeKonsumen = Ext.create('Ext.form.Panel', {
		border: false,
		frame: true,
		region: 'center',
		title: 'Penyerahan BPKB Ke Konsumen',
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
				title: 'Detail BPKB',
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
					style: 'padding: 1px;',
					items: [{
						anchor: '98%',
						layout: 'hbox',
						xtype: 'container',
						items: [{
							flex: 1,
							layout: 'anchor',
							xtype: 'container',
							items: [{
								anchor: '98%',
								title: 'Detail BPKB',
								style: 'padding: 5px;',
								xtype: 'fieldset',
								items: [
									cboNoBPKB,
									txtNoPJJ,
									txtNamaKonsumen,
									txtJenisKendaraan,
									txtTahunKendaraan,
									txtWarnaKendaraan,
									txtNomerRangka,
								]
							}]
						},{
							flex: 1,
							layout: 'anchor',
							xtype: 'container',
							style: 'padding: 1px;',
							items: [{
								anchor: '100%',
								style: 'padding: 7px;',
								title: 'Detail BPKB',
								xtype: 'fieldset',
								items: [
									txtNomerMesin,
									txtNoPolisi,
									txtNoBPKB,
									cboTglTerbit,
									cboTglTerbitSTNK,
									txtNoFaktur,
									txtNoTempatBPKB,
									txtNoLoker
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
				title: 'Status Konsumen',
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
					style: 'padding: 1px;',
					items: [{
						anchor: '50%',
						layout: 'hbox',
						xtype: 'container',
						items: [{
							flex: 1,
							layout: 'anchor',
							xtype: 'container',
							items: [{
								anchor: '80%',
								title: 'Status Konsumen',
								style: 'padding: 5px;',
								xtype: 'fieldset',
								items: [
									txtNoPJJ1,
									txtNamaKonsumen1,
									txtpiutang,
									txtpokok,
									txtdenda,
									btnOK
								]
							}]
						}]
					}]
				}]
			},{
				id: 'tab3',
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
					anchor: '100%',
					style: 'padding: 5px;',
					title: 'History',
					xtype: 'fieldset',
					items: [
						gridHistory
					]
				}]	
			}]		
		}]
	});

	var vMask = new Ext.LoadMask({
		msg: 'Please wait...',
		target: frmPenyerahanKeKonsumen
	});

	function fnMaskShow() {
		frmPenyerahanKeKonsumen.mask('Please wait...');
	}

	function fnMaskHide() {
		frmPenyerahanKeKonsumen.unmask();
	}
	
	frmPenyerahanKeKonsumen.render(Ext.getBody());
	Ext.get('loading').destroy();
});