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

	Ext.define('DataGridTBO', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_no_pjj', type: 'string'},
			{name: 'fs_nama_konsumen', type: 'string'},
			{name: 'fs_model_kendaraan', type: 'string'},
			{name: 'fs_warna_kendaraan', type: 'string'},
			{name: 'fs_no_rangka', type: 'string'},
			{name: 'fs_no_mesin', type: 'string'},
			//{name: 'fd_tanggal_janji', type: 'string'},
			{name: 'fs_nama_dealer', type: 'string'},
			//{name: 'fd_hari_tbo', type: 'string'},
			{name: 'fs_model_kendaraan', type: 'string'},
		]
	});

	Ext.define('DataGridDataPendukung', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_kode_cabang', type: 'string'},
			{name: 'fn_no_pjj', type: 'string'},
			{name: 'fs_kode_dokumen', type: 'string'},
			{name: 'fs_nama_dokumen', type: 'string'},
			{name: 'fs_dokumen_upload', type: 'string'}
		]
	});

	Ext.define('DataGridpenyimpanan', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_kode_brangkas', type: 'string'},
			{name: 'fs_nama_loker', type: 'string'},
			{name: 'fs_nama_brangkas', type: 'string'},
		]
	});


	var grupDataPendukung = Ext.create('Ext.data.Store', {
		autoLoad: false,
		model: 'DataGridDataPendukung',
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
			url: 'terimadaridealer/pendukungapk'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_kode_cabang': Ext.getCmp('txtKodeCabang').getValue(),
					'fn_no_pjj': Ext.getCmp('txtNoAPKPendukung').getValue(),
				});
			}
		}
	});

	var grupPenyimpananBPKB = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridpenyimpanan',
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
			url: 'PemindahanBPKB/gridpenyimpananbpkb'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari1').getValue()
				});
			}
		}		
	});

	var grupDokumen = Ext.create('Ext.data.Store', {
		autoLoad: false,
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
			url: 'terimadaridealer/selectdokumen'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_jenis_pembiayaan': 'P',
					'fs_jenis_dokumen': 'APK'
				});
			}
		}
	});

	var grupTBO = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridTBO',
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
			url: 'terimadaridealer/gridtbo'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari').getValue()
				});
			}
		}		
	});

	var grupNopol = Ext.create('Ext.data.Store', {
		fields: [
			'fs_kode_plat','fs_wilayah','fs_kode_wilayah'
		],
		proxy: {
			actionMethods: {
				read: 'POST'
			},
			reader: {
				rootProperty: 'hasil',
				totalProperty: 'total',
				type: 'json',
			},
			type: 'ajax',
			url: 'terimadaridealer/ambilPlat'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari80').getValue()
				});
			}
		}
	});

	var winGridNoPol= Ext.create('Ext.grid.Panel', {
		//autoDestroy: true,
		autoDestroy: true,
		height: 450,
		width: 550,
		sortableColumns: false,
		store: grupNopol,
		bbar: Ext.create('Ext.PagingToolbar', {
			displayInfo: true,
			pageSize: 25,
			plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
			store: grupNopol,
			items:[
				'-', {
				text: 'Keluar',
				handler: function() {
					Ext.getCmp('txtCari80').setValue('');
					winCariNoPol.hide();
				}
			}]
		}),
		tbar: [{
			flex: 1,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'Kode Wilayah',
				id: 'txtCari80',
				name: 'txtCari80',
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
					grupNopol.load();
				}
			}]
		},{
			flex: 0.5,
			layout: 'anchor',
			xtype: 'container',
			items: []
		}],
		columns: [
			{xtype: 'rownumberer', width: 45},
			{text: 'Kode Plat', dataIndex: 'fs_kode_plat', menuDisabled: true, width: 100},
			{text: 'Wilayah', dataIndex: 'fs_wilayah', menuDisabled: true, width: 240},
			{text: 'Kode Wilayah Asuransi', dataIndex: 'fs_kode_wilayah', menuDisabled: true, width: 240}
			
		],
		listeners: {
			itemdblclick: function(grid, record)
			{
				Ext.getCmp('cboNoPol').setValue(record.get('fs_kode_plat'));
				winCariNoPol.hide();
			}
		},
		viewConfig: {
			getRowClass: function() {
				return 'rowwrap';
			}
		}
	});
	
	var winCariNoPol = Ext.create('Ext.window.Window', {
		border: false,
		closable: false,
		draggable: true,
		frame: false,
		layout: 'fit',
		plain: true,
		resizable: false,
		title: 'Searching...',
		items: [
			winGridNoPol
		],
		listeners: {
			beforehide: function() {
				vMask.hide();
			},
			beforeshow: function() {
				grupNopol.load();
				vMask.show();
			}
		}
	});

	var winGrid2 = Ext.create('Ext.grid.Panel', {
		anchor: '100%',
		autoDestroy: true,
		height: 450,
		width: 550,
		sortableColumns: false,
		store: grupDataPendukung,
		columns: [
			{xtype: 'rownumberer', width: 45},
			{text: "Kode Dokumen", dataIndex: 'fs_kode_dokumen', menuDisabled: true, flex: 1},
			{text: "Nama Dokumen", dataIndex: 'fs_nama_dokumen', menuDisabled: true, flex: 2.5},
			{text: "File Upload", dataIndex: 'fs_dokumen_upload', menuDisabled: true, hidden: true},
			{
				xtype:'actioncolumn',
			    width:20,
			    items: [{
			    	iconCls: 'icon-delete',
			        tooltip: 'Delete',
			        handler: function(grid, rowIndex, colIndex, e) {
			        	var str = grid.getStore().getAt(rowIndex).get('fs_dokumen_upload');
			        	if (str) {
			        		Ext.MessageBox.show({
			        			title:'Delete file',
			        			msg: 'Apakah Anda Yakin Akan Menghapus?',
			        			buttons: Ext.Msg.YESNO,
			        			icon: Ext.Msg.QUESTION,
			        			fn: function(btn) {
			        				if (btn == "yes") {
			        					Ext.Ajax.request({
			        						url : 'Terimadaridealer/remove/',
			        						params : {
												'fs_dokumen_upload' : str
											},
											success: function(response) {
												var xtext = Ext.decode(response.responseText);
												Ext.MessageBox.show({
													buttons: Ext.MessageBox.OK,
													closable: false,
													icon: Ext.MessageBox.INFO,
													message: xtext.hasil,
													title: 'MFAS'
												});

												// LOAD DATA
												grupDataPendukung.load();
											},
											failure: function(response) {
												var xtext = Ext.decode(response.responseText);
												Ext.MessageBox.show({
													buttons: Ext.MessageBox.OK,
													closable: false,
													icon: Ext.MessageBox.INFO,
													message: xtext.hasil,
													title: 'MFAS'
												});
											}
			        					});
			        				}
			        			}
			        		});
			        	}
			        },
			        scope: this
			    }]
			}
		],
		tbar: [{
			anchor: '100%',
			layout: 'hbox',
			width: 540,
			id: 'winPendukung',
			name: 'winPendukung',
			xtype: 'form',
			enctype : 'multipart/form-data', 
			method: 'POST',
			bodyStyle: 'background-color: '.concat(gBasePanel),
			fileUpload: true,
			border: false,
			items: [{
				flex: 2,
				layout: 'anchor',
				xtype: 'container',
				items: [{
					afterLabelTextTpl: required,
					allowBlank: false,
					anchor: '98%',
					emptyText: 'Dokumen',
					displayField: 'fs_nama',
					editable: false,
					id: 'cboDokumen',
					name: 'cboDokumen',
					store: grupDokumen,
					valueField: 'fs_kode',
					xtype: 'combobox'
				}]
			},{
				flex: 2,
				layout: 'anchor',
				xtype: 'container',
				items: [{
					afterLabelTextTpl: required,
					allowBlank: false,
					anchor: '98%',
					emptyText: 'Pilih File',
					id: 'fileDokumen',
					name: 'fileDokumen',
					xtype: 'fileuploadfield',
					buttonCfg: {
		                text: 'Browse',
		                iconCls: 'icon-upload'
		            }
				},{
					id: 'txtKodeCabang',
					name: 'txtKodeCabang',
					xtype: 'textfield',
					hidden: true
				},{
					id: 'txtNoAPKPendukung',
					name: 'txtNoAPKPendukung',
					xtype: 'textfield',
					hidden: true
				}]
			},{
				flex: 0.5,
				layout: 'anchor',
				xtype: 'container',
				items: [{
					xtype: 'buttongroup',
					defaults: {
						scale: 'small'
					},
					items: [{
						iconCls: 'icon-add',
						itemId: 'addData',
						text: 'Upload',
						anchor: '98%',
						handler: function () {
							var form = this.up('#winPendukung').getForm();
							if (form.isValid()) {
								form.submit({
									url: 'terimadaridealer/uploadfile',
									waitMsg: 'Uploading your file...',
									success: function (form, action) {
										var result = action.result; 
			                        	var data = result.data;
			                        	var name = data.name;
			                        	var message = Ext.String.format('<b>Message:</b> {0}<br>' +'<b>FileName:</b> {1}', result.msg, name);
			                        	Ext.Msg.alert('Success', message);

			                        	// LOAD DATA
			                        	grupDataPendukung.load();
									},
									failure: function (form, action) {
										Ext.Msg.alert('Failure', action.result.msg);
									}
								});
							}
						}
					}]
				}]
			}]
		}],
		bbar: Ext.create('Ext.PagingToolbar', {
			displayInfo: true,
			pageSize: 25,
			plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
			store: grupDataPendukung,
			items:[
				'-', {
				text: 'Exit',
				handler: function() {
					winPopup.hide();
				}
			}]
		}),
		listeners: {
			celldblclick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts)
			{
				var dokumen_name = record.get('fs_nama_dokumen');
				var dokumen_url = 'uploads/' + record.get('fs_dokumen_upload');

				var viewImage =  Ext.create('Ext.Panel', {
					items: Ext.create('Ext.view.View', {
						xtype: 'dataview',
						tpl: [
							'<div style="overflow: auto; width:888; height:465; text-align:center;">',
					        '<img src="' + dokumen_url + '" height:"100%" width:"100%"/>',
					        '</div>'
					    	],
					})
				});

				var winImage = Ext.create('Ext.window.Window', {
					title: dokumen_name,
					border: false,
					frame: false,
					autoScroll: false,
					width: 900,
					height: 500,
					collapsible: false,
					resizable: true,
					layout: 'fit',
					items: [
						viewImage
					]
				});
				
				winImage.show();
			}
		},
		viewConfig: {
			enableTextSelection: true
		}
	});

	var winPopup = Ext.create('Ext.window.Window', {
		border: false,
		closable: false,
		draggable: true,
		frame: false,
		layout: 'fit',
		plain: true,
		resizable: false,
		title: 'Tambah Data Pendukung',
		items: [
			winGrid2
		],
		listeners: {
			beforehide: function() {
				vMask.hide();
			},
			beforeshow: function() {
				grupDataPendukung.load();
				vMask.show();
			}
		}
	});

	function fnPopup() {
		winPopup.show();
		winPopup.center();
	}

	var btnDataPendukung = {
		anchor: '100%',
		scale: 'medium',
		text: 'Data Pendukung',
		xtype: 'button',
		handler: fnPopup
	};

	var winGrid1 = Ext.create('Ext.grid.Panel', {
		anchor: '100%',
		autoDestroy: true,
		height: 450,
		width: 500,
		sortableColumns: false,
		store: grupPenyimpananBPKB,
		columns: [
			{xtype: 'rownumberer', width: 45},
			{text: "No. Brangkas", dataIndex: 'fs_kode_brangkas', menuDisabled: true, flex: 1},
			{text: "Nama Brangkas", dataIndex: 'fs_nama_brangkas', menuDisabled: true, flex: 3},
		],
		tbar: [{
			flex: 1.4,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'No. Brangkas',
				id: 'txtCari1',
				name: 'txtCari1',
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
					grupPenyimpananBPKB.load();
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
			store: grupPenyimpananBPKB,
			items:[
				'-', {
				text: 'Exit',
				handler: function() {
					winCari1.hide();
				}
			}]
		}),
		listeners: {
			itemdblclick: function(grid, record) {
				Ext.getCmp('cboTempatBPKB').setValue(record.get('fs_kode_brangkas'));
				Ext.getCmp('txtNoLoker').setValue(record.get('fs_nama_loker'));
				winCari1.hide();
			}
		},
		viewConfig: {
			getRowClass: function() {
				return 'rowwrap';
			},
			markDirty: false
		}
	});

	var winCari1 = Ext.create('Ext.window.Window', {
		border: false,
		closable: false,
		draggable: true,
		frame: false,
		layout: 'fit',
		plain: true,
		resizable: false,
		title: 'Searching...',
		items: [
			winGrid1
		],
		listeners: {
			beforehide: function() {
				vMask.hide();
			},
			beforeshow: function() {
				grupPenyimpananBPKB.load();
				vMask.show();
			}
		}
	});

	var txtKodeCabang = {
		id: 'txtKodeCabang',
		name: 'txtKodeCabang',
		xtype: 'textfield',
		hidden: true
	};

	var txtNoAPKTab1 = {
		id: 'txtNoAPKTab1',
		name: 'txtNoAPKTab1',
		xtype: 'textfield',
		hidden: true
	};
	// COMPONENT FORM BPKB

	var btnDataScan = {
		anchor: '100%',
		scale: 'medium',
		text: 'Data Scan BPKB',
		xtype: 'button',
		handler: fnPopup
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

	var txtNama = {
		anchor: '100%',
		fieldLabel: 'Nama Konsumen',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNama',
		name: 'txtNama',
		xtype: 'textfield'
	};

	var txtJenisKendaraan = {
		anchor: '100%',
		fieldLabel: 'model Kendaraan',
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

	var txtAgunan = {
		anchor: '100%',
		fieldLabel: 'No. Agunan',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtAgunan',
		name: 'txtAgunan',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 15,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var cboNoPol = {
		anchor: '100%',
		fieldLabel: 'No. Polisi',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'cboNoPol',
		name: 'cboNoPol',
		xtype: 'textfield',
		triggers: {
			reset: {
				cls: 'x-form-clear-trigger',
				handler: function(field) {
					field.setValue('');
					Ext.getCmp('txtWilayahAsuransi').setValue('');
				}
			},
			cari: {
				cls: 'x-form-search-trigger',
				handler: function() {
					winCariNoPol.show();
					winCariNoPol.center();
				}
			}
		}
	};

	var txtNoPOl = {
		anchor: '100%',
		fieldLabel: '',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNoPOl',
		name: 'txtNoPOl',
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

	var txtNoPOl1 = {
		anchor: '100%',
		fieldLabel: '',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNoPOl1',
		name: 'txtNoPOl1',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 2,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtNoBPKB = {

		anchor: '100%',
		fieldLabel: 'No. BPKB',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNoBPKB',
		name: 'txtNoBPKB',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 15,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
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

	var cboTglTerima = {
		anchor: '98%',
		editable: true,
		fieldLabel: 'Tgl Terima BPKB',
		format: 'd-m-Y',
		id: 'cboTglTerima',
		name: 'cboTglTerima',
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

	var txtNoFaktur = {
		anchor: '100%',
		fieldLabel: 'No. Faktur',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNoFaktur',
		name: 'txtNoFaktur',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 15,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var cboTempatBPKB = {
		anchor: '100%',
		fieldLabel: 'Tempat BPKB',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'cboTempatBPKB',
		name: 'cboTempatBPKB',
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
					winCari1.show();
					winCari1.center();
				}
			}
		}
	};

	var txtNoLoker = {
		anchor: '100%',
		fieldLabel: 'No. Loker',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNoLoker',
		name: 'txtNoLoker',
		xtype: 'textfield'
	};

	// GRID TBO
	var gridTBO = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 400,
		sortableColumns: false,
		store: grupTBO,
		columns: [{
			xtype: 'rownumberer',
			width: 25
		},{
			text: 'No. PJJ',
			dataIndex: 'fn_no_pjj',
			menuDisabled: true,
			flex: 1
		},{
			text: 'Nama Konsumen',
			dataIndex: 'fs_nama_pemilik',
			menuDisabled: true,
			flex: 2
		},{
			text: 'Nama Dealer',
			dataIndex: 'fs_nama_dealer',
			menuDisabled: true,
			flex: 1
		},{
			text: 'Tanggal Janji Selesai',
			dataIndex: 'fd_tanggal_janji',
			menuDisabled: true,
			flex: 1
		},{
			text: 'Hari TBO',
			dataIndex: 'fd_hari_tbo',
			menuDisabled: true,
			flex: 1
		}],
		tbar: [{
			flex: 1,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'Nama Konsumen / No. PJJ',
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
					grupTBO.load();
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
			store: grupTBO
		}),
		listeners: {
			itemdblclick: function(grid, record) {
				Ext.getCmp('txtNoPJJ').setValue(record.get('fn_no_pjj'));
				Ext.getCmp('txtNama').setValue(record.get('fs_nama_pemilik'));
				Ext.getCmp('txtJenisKendaraan').setValue(record.get('fs_jenis_kendaraan'));
				Ext.getCmp('txtTahunKendaraan').setValue(record.get('fn_tahun_kendaraan'));
				Ext.getCmp('txtWarnaKendaraan').setValue(record.get('fs_warna_kendaraan'));
				Ext.getCmp('txtNomerMesin').setValue(record.get('fs_no_mesin'));
				Ext.getCmp('txtNomerRangka').setValue(record.get('fs_no_rangka'));
				
				// SET VALUE IN WIN POPUP
				Ext.getCmp('txtNoAPKPendukung').setValue(record.get('fn_no_pjj'));

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

	function fnCekSave() {
		if (this.up('form').getForm().isValid()) {
			Ext.Ajax.on('beforerequest', fnMaskShow);
			Ext.Ajax.on('requestcomplete', fnMaskHide);
			Ext.Ajax.on('requestexception', fnMaskHide);

			Ext.Ajax.request({
				method: 'POST',
				url: 'terimadaridealer/ceksave',
				params: {
					'fn_no_pjj': Ext.getCmp('txtNoPJJ').getValue()
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
	/*
		var xtanggal = '';
		var xfasilitas = '';
		var xplafon = '';

		var store = gridFasilitas.getStore();
		store.each(function(record, idx) {
			xtanggal = xtanggal +'|'+ record.get('fd_tanggal_berlaku');
			xfasilitas = xfasilitas +'|'+ record.get('fs_nama_fasilitas');
			xplafon = xplafon +'|'+ record.get('fn_plafon');
		});
	*/
		Ext.Ajax.on('beforerequest', fnMaskShow);
		Ext.Ajax.on('requestcomplete', fnMaskHide);
		Ext.Ajax.on('requestexception', fnMaskHide);

		Ext.Ajax.request({
			method: 'POST',
			url: 'Terimadaridealer/save',
			params: {
				'fn_no_pjj': Ext.getCmp('txtNoPJJ').getValue(),
				'fs_nama_pemilik': Ext.getCmp('txtNama').getValue(),
				'fs_jenis_kendaraan': Ext.getCmp('txtJenisKendaraan').getValue(),
				'fn_tahun_kendaraan': Ext.getCmp('txtTahunKendaraan').getValue(),
				'fs_warna_kendaraan': Ext.getCmp('txtWarnaKendaraan').getValue(),
				'fs_no_mesin': Ext.getCmp('txtNomerMesin').getValue(),
				'fs_no_rangka': Ext.getCmp('txtNomerRangka').getValue(),
				'fs_no_bpkb': Ext.getCmp('txtNoBPKB').getValue(),
				'fd_tanggal_terbit': Ext.getCmp('cboTglTerbit').getValue(),
				'fd_terima_bpkb': Ext.getCmp('cboTglTerima').getValue(),
				'fd_terbit_stnk': Ext.getCmp('cboTglTerbitSTNK').getValue(),
				'fs_no_faktur': Ext.getCmp('txtNoFaktur').getValue(),
				'fs_tempat_bpkb': Ext.getCmp('cboTempatBPKB').getValue(),
				'fs_nama_loker': Ext.getCmp('txtNoLoker').getValue(),
				'fs_nama_loker': Ext.getCmp('txtNoLoker').getValue(),
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

				fnReset();

				// REFRESH AFTER SAVE
				grupTBO.load();
				
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

	function fnReset() {
		// COMPONENT FORM Master Kreditur
		Ext.getCmp('txtNoPJJ').setValue('');					
		Ext.getCmp('txtNama').setValue('');
		Ext.getCmp('txtJenisKendaraan').setValue('');
		Ext.getCmp('txtTahunKendaraan').setValue('');
		Ext.getCmp('txtWarnaKendaraan').setValue('');
		Ext.getCmp('txtNomerMesin').setValue('');
		Ext.getCmp('txtNomerRangka').setValue('');
		Ext.getCmp('txtAgunan').setValue('');
		Ext.getCmp('txtNoBPKB').setValue('');
		Ext.getCmp('cboTglTerbit').setValue('');
		Ext.getCmp('cboTglTerima').setValue('');
		Ext.getCmp('cboTglTerbitSTNK').setValue('');
		Ext.getCmp('txtNoFaktur').setValue('');
		Ext.getCmp('cboTempatBPKB').setValue('');
		Ext.getCmp('txtNoLoker').setValue('');
		Ext.getCmp('cboNoPol').setValue('');
		Ext.getCmp('txtNoPOl').setValue('');
		Ext.getCmp('txtNoPOl1').setValue('');
	}

	var frmTerimaDariDealer = Ext.create('Ext.form.Panel', {
		border: false,
		frame: true,
		region: 'center',
		title: 'BPKB Dari Dealer',
		width: 950,
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
				title: 'Terima BPKB Dari Dealer',
				xtype: 'form',
				items: [{
					fieldDefaults: {
						labelAlign: 'right',
						labelSeparator: '',
						labelWidth: 120,
						msgTarget: 'side'
					},	
					xtype: 'fieldset',
					title: 'Daftar BPKB TBO',
					style: 'padding: 5px;',
					items: [
						gridTBO
					]
				}],
				
			},{
				id: 'tab2',
				bodyStyle: 'background-color: '.concat(gBasePanel),
				border: false,
				frame: false,
				title: 'Input BPKB',
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
								title: 'TBO',
								xtype: 'fieldset',
								items: [
									txtNoPJJ,
									txtNama,
									txtJenisKendaraan,
									txtTahunKendaraan,
									txtWarnaKendaraan,
									txtNomerMesin,
									txtNomerRangka,
									txtAgunan
								]
							}]
						},{
							flex: 1,
							layout: 'anchor',
							xtype: 'container',
							items: [{
								anchor: '100%',
								layout: 'hbox',
								xtype: 'container',
								items: [{
									flex: 1,
									layout: 'anchor',
									xtype: 'container',
									items: [
									cboNoPol	
									]
								},{
									flex: 0.1,
									layout: 'anchor',
									xtype: 'container',
									items: [

									]
								},{				
									flex:0.5,
									layout: 'anchor',
									xtype: 'container',
									items: [
										txtNoPOl
									]
								},{
									flex: 0.1,
									layout: 'anchor',
									xtype: 'container',
									items: [

									]
								},{
									flex:0.5,
									layout: 'anchor',
									xtype: 'container',
									items: [
										txtNoPOl1
									]
								}]

						},{
							flex:1,
								layout: 'anchor',
								xtype: 'container',
								items: [
									txtNoBPKB,
									cboTglTerbit,
									cboTglTerima,
									cboTglTerbitSTNK,
									txtNoFaktur,
									cboTempatBPKB,
									txtNoLoker,
									btnDataPendukung
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
					handler:fnReset
				}]			
			}]		
		}]	
	});		

	var vMask = new Ext.LoadMask({
		msg: 'Please wait...',
		target: frmTerimaDariDealer
	});

	function fnMaskShow() {
		frmTerimaDariDealer.mask('Please wait...');
	}

	function fnMaskHide() {
		frmTerimaDariDealer.unmask();
	}
	
	frmTerimaDariDealer.render(Ext.getBody());
	Ext.get('loading').destroy();
});