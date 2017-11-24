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
		]
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

	var grupApkPendukung = Ext.create('Ext.data.Store', {
		autoLoad: false,
		fields: [
			'fn_no_apk','fs_kode_cabang',
			'fs_kode_dokumen','fs_dokumen_upload',
			'fd_tanggal_buat', 'fs_iduser_buat'
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
			url: 'terimadaridealer/apkpendukung'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_kode_cabang': Ext.getCmp('txtKdCabang').getValue(),
					'fn_no_apk': Ext.getCmp('txtNoApk').getValue(),
					'fn_no_batch': Ext.getCmp('txtNoBatch').getValue(),
					'fs_jenis_pembiayaan': Ext.getCmp('txtJnsPembiayaan').getValue()
				});
			}
		}
	});

	var winData = Ext.create('Ext.grid.Panel',{
		anchor: '100%',
		autoDestroy: true,
		height: 450,
		width: 685,
		sortableColumns: false,
		store: grupApkPendukung,
		columns: [
			{xtype: 'rownumberer', width: 45},
			{text: "Kode Dokumen", dataIndex: 'fs_kode_dokumen', menuDisabled: true, width: 100},
			{text: "Nama Dokumen", dataIndex: 'fs_nama_dokumen', menuDisabled: true, width: 240},
			{text: "Tipe Dokumen", dataIndex: 'fs_wajib', menuDisabled: true, width: 100},
			{text: "File", dataIndex: 'fs_dokumen_upload', menuDisabled: true, hidden: true},
			{text: "Tanggal", dataIndex: 'fd_tanggal_buat', menuDisabled: true, width: 80},
			{text: "User", dataIndex: 'fs_iduser_buat', menuDisabled: true, width: 80},
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
			            		msg: 'Would you like to delete?',
			            		buttons: Ext.Msg.YESNO,
			            		icon: Ext.Msg.QUESTION,
			            		fn: function(btn){                    
							        if (btn == "yes"){
						            	Ext.Ajax.request({
											url : 'terimadaridealer/remove/',
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
													title: 'SIAP'
												});
												grupApkPendukung.load();  
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
							        if (btn == "no"){
							        	grupApkPendukung.load(); 
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
			anchor: '95%',
			layout: 'hbox',
			xtype: 'form',
			enctype : 'multipart/form-data', 
			method: 'POST',
			fileUpload: true,
			items: [{
				flex: 1,
				layout: 'anchor',
				xtype: 'container',
				style: 'padding: 5px;',
				items: [{
					width: 120,
					afterLabelTextTpl: required,
					allowBlank: false,
					emptyText: 'Kode Dokumen',
					id: 'cboKodeDoc',
					name: 'cboKodeDoc',
					xtype: 'textfield',
					listeners: {
						change: function(field, newValue) {
						}
					},
					triggers: {
						reset: {
							cls: 'x-form-clear-trigger',
							handler: function(field) {
								field.setValue('');
							}
						},
						cari: {
							cls: 'x-form-search-trigger',
							handler: function() {
								winCari2.show();
								winCari2.center();
							}
						}
					}
				},{
					id: 'txtKdCabang',
					name: 'txtKdCabang',
					xtype: 'textfield',
					hidden: true
				},{
					id: 'txtNoApk',
					name: 'txtNoApk',
					xtype: 'textfield',
					hidden: true
				},{
					id: 'txtNoBatch',
					name: 'txtNoBatch',
					xtype: 'textfield',
					hidden: true
				},{
					id: 'txtJnsPembiayaan',
					name: 'txtJnsPembiayaan',
					xtype: 'textfield',
					hidden: true
				}]
			},{
				flex: 2,
				layout: 'anchor',
				xtype: 'container',
				style: 'padding: 5px;',
				items: [{
					width: 390,
					afterLabelTextTpl: required,
					allowBlank: false,
					emptyText: 'Pilih File',
					id: 'fileDoc',
					name: 'fileDoc',
					xtype: 'fileuploadfield',
					buttonCfg: {
		                text: 'Browse',
		                iconCls: 'icon-upload'
		            }
				}]
			},{
				flex: 3,
				layout: 'anchor',
				anchor: '100%',
				xtype: 'container',
				style: 'padding: 5px;',
				items: [{
					xtype: 'buttongroup',
					defaults: {
						scale: 'small'
					},
					items: [{
						iconCls: 'icon-add',
						itemId: 'addData',
						text: 'Add',
						handler: function () {
			                var form = this.up('form').getForm();
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
                            			grupApkPendukung.load();
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
			store: grupApkPendukung,
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
			winData
		],
		listeners: {
			beforehide: function() {
				vMask.hide();
			},
			beforeshow: function() {
				grupApkPendukung.load();
				vMask.show();
			}
		}
	});

	var grupDataPendukung = Ext.create('Ext.data.Store', {
		autoLoad: false,
		fields: [
			'fs_kode_dokumen','fs_jenis_pembiayaan',
			'fs_no','fs_nama_dokumen',
			'fs_jenis_dokumen', 'fs_jenis_pembiayaan', 'fs_wajib'
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
			url: 'terimadaridealer/datapendukung'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari4').getValue()
				});
			}
		}
	});

	var winGrid2 = Ext.create('Ext.grid.Panel',{
		anchor: '100%',
		autoDestroy: true,
		height: 450,
		width: 550,
		sortableColumns: false,
		store: grupDataPendukung,
		columns: [
			{xtype: 'rownumberer', width: 45},
			{text: "Kode Dokumen", dataIndex: 'fs_kode_dokumen', menuDisabled: true, width: 100},
			{text: "Nama Dokumen", dataIndex: 'fs_nama_dokumen', menuDisabled: true, width: 280},
			{text: "Tipe Dokumen", dataIndex: 'fs_wajib', menuDisabled: true, width: 100},
			{text: "Jenis Pembiayaan", dataIndex: 'fs_wajib', menuDisabled: true, hidden: true}
		],
		tbar: [{
			flex: 1,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'Nama Dokumen',
				id: 'txtCari4',
				name: 'txtCari4',
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
					grupDataPendukung.load();
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
			store: grupDataPendukung,
			items:[
				'-', {
				text: 'Exit',
				handler: function() {
					winCari2.hide();
				}
			}]
		}),
		listeners: {
			itemdblclick: function(grid, record)
			{
				Ext.getCmp('cboKodeDoc').setValue(record.get('fs_kode_dokumen'));

				grupDataPendukung.load();
				winCari2.hide();
			}
		},
		viewConfig: {
			getRowClass: function() {
				return 'rowwrap';
			},
			markDirty: false
		}
	});

	var winCari2 = Ext.create('Ext.window.Window', {
		border: false,
		closable: false,
		draggable: true,
		frame: false,
		layout: 'fit',
		plain: true,
		resizable: false,
		title: 'Searching...',
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

	Ext.define('DataGridpenyimpanan', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_kode_brangkas', type: 'string'},
			{name: 'fs_nama_loker', type: 'string'},
			{name: 'fs_nama_brangkas', type: 'string'},
		]
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
		afterLabelTextTpl: required,
		allowBlank: false,
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
		afterLabelTextTpl: required,
		allowBlank: false,
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
		afterLabelTextTpl: required,
		allowBlank: false,
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
		maxLength: 15,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var cboTempatBPKB = {
		afterLabelTextTpl: required,
		allowBlank: false,
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
			dataIndex: 'fs_no_pjj',
			menuDisabled: true,
			flex: 1
		},{
			text: 'Nama Konsumen',
			dataIndex: 'fs_nama_konsumen',
			menuDisabled: true,
			flex: 1
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
				Ext.getCmp('txtNoPJJ').setValue(record.get('fs_no_pjj'));
				Ext.getCmp('txtNama').setValue(record.get('fs_nama_konsumen'));
				Ext.getCmp('txtJenisKendaraan').setValue(record.get('fs_model_kendaraan'));
				Ext.getCmp('txtTahunKendaraan').setValue(record.get('fn_tahun_kendaraan'));
				Ext.getCmp('txtWarnaKendaraan').setValue(record.get('fs_warna_kendaraan'));
				Ext.getCmp('txtNomerMesin').setValue(record.get('fs_no_mesin'));
				Ext.getCmp('txtNomerRangka').setValue(record.get('fs_no_rangka'));
		
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

	function fnCeksave() {

	}

	function fnSave() {
	
	}

	function fnReset() {
		grupTBO.load();
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
					handler:''
				},{
					iconCls: 'icon-reset',
					text: 'Reset',
					scale: 'medium',
					handler:''
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