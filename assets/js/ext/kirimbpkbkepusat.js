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

	Ext.define('DataGridKirimBPKB', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_no_bpkb', type: 'string'},
		]
	});

	var grupKirim = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridKirimBPKB',
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
			url: 'Kirimkepusat/gridkirimbpkb'
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
		store: grupKirim,
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
					grupKirim.load();
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
			store: grupKirim,
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
				grupKirim.load();
				vMask.show();
			}
		}
	});

	Ext.define('DataGriddaftar', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fd_tgl_kirim', type: 'string'},
			{name: 'fs_pengirim', type: 'string'},
			{name: 'fs_jumlah_bpkb', type: 'string'},
			{name: 'fs_status', type: 'string'},
		]
	});

	var grupDaftar = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGriddaftar',
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
			url: 'recheckbpkb/griddaftar'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari1').getValue()
				});
			}
		}		
	});

	// GRID KIRIM BPKB
	var gridkirim = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 400,
		sortableColumns: false,
		//store: grupKirim,
		columns: [{
			xtype: 'rownumberer',
			width: 25
		},{
			text: 'No. BPKB',
			dataIndex: 'fs_no_bpkb',
			menuDisabled: true,
			flex: 1
		},{
			xtype:'actioncolumn',
			width: 50,
			items: [{
				iconCls: 'icon-delete',
				tooltip: 'Delete',
				handler: function(grid, rowIndex, colIndex, e) {
					var str = grid.getStore().getAt(rowIndex).get('fs_no_bpkb');
					if (str) {
						Ext.MessageBox.show({
							title:'Menghapus Data',
							msg: 'Apakah Anda ingin menghapus?',
							buttons: Ext.Msg.YESNO,
							icon: Ext.Msg.QUESTION,
							fn: function(btn) {
								if (btn == "yes") {
									Ext.Ajax.request({
										url : 'Kirimkepusat/remove/',
			            				params : {
											'fs_no_bpkb': str
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
											//fnResetUser();
											//grupKirim.load();  
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
			//store: grupKirim	
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
		
				// CHANGE TAB
				var tabPanel = Ext.ComponentQuery.query('tabpanel')[0];
				tabPanel.setActiveTab('tab1');
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

	// GRID DAFTAR KIRIM BPKB
	var gridDaftar = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 400,
		sortableColumns: false,
		store: grupDaftar,
		columns: [{
			xtype: 'rownumberer',
			width: 25
		},{
			text: 'Tanggal Kirim',
			dataIndex: 'fd_tgl_kirim',
			menuDisabled: true,
			flex: 1
		},{
			text: 'Pengirim',
			dataIndex: 'fs_pengirim',
			menuDisabled: true,
			flex: 1
		},{
			text: 'Jumlah BPKB',
			dataIndex: 'fs_jumlah_bpkb',
			menuDisabled: true,
			flex: 1
		},{
			text: 'Status Diterima',
			dataIndex: 'fs_status',
			menuDisabled: true,
			flex: 1
		}],
		tbar: [{
			flex: 1,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'Tanggal Kirim',
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
					grupDaftar.load();
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
			store: grupDaftar
		}),
		listeners: {
			itemdblclick: function(grid, record) {

				// CHANGE TAB
				var tabPanel = Ext.ComponentQuery.query('tabpanel')[0];
				tabPanel.setActiveTab('tab1');
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

	// COMPONENT FORM KIRIM BPKB KE PUSAT
	var cboNoBPKB = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		labelAlign: 'top',
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
		text: 'Tambah',
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

	var frmKirimBPKBKePusat = Ext.create('Ext.form.Panel', {
		border: false,
		frame: true,
		region: 'center',
		title: 'Kirim BPKB ke Pusat',
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
								title: '',
								xtype: 'fieldset',
								items: [
									cboNoBPKB,
									gridkirim,
									btnKirim
								]
							}]
						},{
							flex: 1,
							layout: 'anchor',
							xtype: 'container',
							items: [{
								anchor: '100%',
								style: 'padding: 7px;',
								title: '',
								xtype: 'fieldset',
								items: [
									txtNoPJJ,
									txtNamaKonsumen,
									txtJenisKendaraan,
									txtTahunKendaraan,
									txtWarnaKendaraan,
									txtNomerRangka,
									txtNomerMesin,
									txtNoPolisi,
									txtNoBPKB,
									cboTglTerbit,
									cboTglTerbitSTNK,
									txtNoFaktur,
									txtNoTempatBPKB,
									txtNoLoker,
									btnOK
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
				title: 'Daftar Kirim BPKB',
				items: [{
					fieldDefaults: {
						labelAlign: 'right',
						labelSeparator: '',
						labelWidth: 120,
						msgTarget: 'side'
					},
					style: 'padding: 5px;',
					title: '',
					xtype: 'fieldset',
					items: [
						gridDaftar
					]
				}]
			}]
		}]
	});

	var vMask = new Ext.LoadMask({
		msg: 'Please wait...',
		target: frmKirimBPKBKePusat
	});

	function fnMaskShow() {
		frmKirimBPKBKePusat.mask('Please wait...');
	}

	function fnMaskHide() {
		frmKirimBPKBKePusat.unmask();
	}
	
	frmKirimBPKBKePusat.render(Ext.getBody());
	Ext.get('loading').destroy();
});