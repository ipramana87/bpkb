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

	var frmKirimPinjamanCabang = Ext.create('Ext.form.Panel', {
		border: false,
		frame: true,
		region: 'center',
		title: 'Kirim Pinjaman Cabang',
		width: 930,
		items: [{
			
		}]
	});

	var vMask = new Ext.LoadMask({
		msg: 'Please wait...',
		target: frmKirimPinjamanCabang
	});

	function fnMaskShow() {
		frmKirimPinjamanCabang.mask('Please wait...');
	}

	function fnMaskHide() {
		frmKirimPinjamanCabang.unmask();
	}
	
	frmKirimPinjamanCabang.render(Ext.getBody());
	Ext.get('loading').destroy();
});