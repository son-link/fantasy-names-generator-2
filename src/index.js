const {
	QMainWindow,
	QWidget,
	QBoxLayout,
	QLabel,
	QPushButton,
	QFileDialog,
	FileMode,
	QScrollArea,
	QMessageBox,
	QTextBrowser,
	QVariant,
	QComboBox,
	QSpinBox,
	ButtonRole
} = require('@nodegui/nodegui');
const fs = require('fs'),
	fng = require('./fng'),
	i18n = require('i18n');


const env = process.env;
let language = env.LANG || env.LANGUAGE || env.LC_ALL || env.LC_MESSAGES;
language = language.split('.')[0];
console.log(language)

i18n.configure({
	directory: __dirname + '/locales',
	register: global,
	fallbacks:{'es_*': 'es'},
	syncFiles: true
});

i18n.setLocale(language);

const races = {
	drows: true,
	elfs: false,
	haflings: true,
	dwarvens: true,
	gnomes: true,
	demons: false,
	dragons: false,
	orcs: false
}

let current_race;
let current_sex;

// The main window.
win = new QMainWindow();
win.setMinimumSize(640, 480);
win.setWindowTitle(__('Fantasy Names Generator'));

const centralWidget = new QWidget();
centralWidget.setObjectName('myroot');
const rootLayout = new QBoxLayout(0);
centralWidget.setLayout(rootLayout);
win.setCentralWidget(centralWidget);

const options = new QWidget();
options.setObjectName('options');
options.setLayout(new QBoxLayout(2));
centralWidget.layout.addWidget(options);

label1 = new QLabel();
label1.setText(__('Select race:'));
options.layout.addWidget(label1);

const select_race = new QComboBox();
select_race.addItem(null, '');
select_race.addItem(null, __('Demons'), new QVariant('demons'));
select_race.addItem(null, __('Dragons'), new QVariant('dragons'));
select_race.addItem(null, __('Drows/Dark Elfs'), new QVariant('drows'));
select_race.addItem(null, __('Dwarvens'), new QVariant('dwarvens'));
select_race.addItem(null, __('Elfs'), new QVariant('elfs'));
select_race.addItem(null, __('Gnomes'), new QVariant('gnomes'));
select_race.addItem(null, __('Haflings'), new QVariant('haflings'));
select_race.addItem(null, __('Orcs'), new QVariant('orcs'));
options.layout.addWidget(select_race);

const label2 = new QLabel();
label2.setText(__('Select sex:'));
options.layout.addWidget(label2);

const select_sex = new QComboBox();
select_sex.addItem(null, '');
select_sex.addItem(null, __('Male'), new QVariant('male'));
select_sex.addItem(null, __('Female'), new QVariant('female'));
select_sex.setEnabled(false);
options.layout.addWidget(select_sex);

const label3 = new QLabel();
label3.setText(__('Total to generate (1-100):'));
options.layout.addWidget(label3);

const total_to_gen = new QSpinBox();
total_to_gen.minimum(1);
total_to_gen.maximum(100);
total_to_gen.setValue(1);
options.layout.addWidget(total_to_gen);

const btn_generate = new QPushButton();
btn_generate.setText(__('Generate names'));
btn_generate.setEnabled(false);
options.layout.addWidget(btn_generate);

const btn_save_names = new QPushButton();
btn_save_names.setText(__('Save names'));
btn_save_names.setEnabled(false);
options.layout.addWidget(btn_save_names);

options.layout.addStretch(1);

const scrollArea = new QScrollArea();
rootLayout.addWidget(scrollArea);

const names_txt = new QTextBrowser();
names_txt.setOpenExternalLinks(true);
scrollArea.setWidget(names_txt);

centralWidget.layout.addWidget(scrollArea);

win.show();
global.win = win;

select_race.addEventListener('currentIndexChanged', (index) => {
	current_race = null;
	if (index > 0) {
		race = select_race.itemData(index).toString();
		current_race = race;
		if (races[race]) {
			select_sex.setEnabled(true);
			if (current_sex) btn_generate.setEnabled(true);
			else btn_generate.setEnabled(false);
		} else {
			select_sex.setEnabled(false);
			btn_generate.setEnabled(true);
		}
	}
});

select_sex.addEventListener('currentIndexChanged', (index) => {
	current_sex = null;
	if (index > 0) {
		sex = select_sex.itemData(index).toString();
		current_sex = sex;
		if (sex) {
			btn_generate.setEnabled(true);
		} else {
			btn_generate.setEnabled(false);
		}
	}
});

btn_generate.addEventListener('clicked', () => {
	names_txt.clear();
	for (i=0; i < total_to_gen.value(); i++) {
		name = (current_sex) ? fng[current_race](current_sex) : name = fng[current_race]();
		names_txt.append(name);
	}
	btn_save_names.setEnabled(true);
});

btn_save_names.addEventListener('clicked', () => {
	const content = names_txt.toPlainText();
	const saveDialog = new QFileDialog();
	saveDialog.setWindowTitle(__('Select where to save names'));
	saveDialog.setFileMode(FileMode.AnyFile);
	saveDialog.setAcceptMode(1);
	saveDialog.setNameFilter(__('Text file (*.txt)'));
	saveDialog.addEventListener('accepted', () => {
		file = saveDialog.selectedFiles()[0];
		write = fs.createWriteStream(file, {flags:'w'})
		.on('error', () => show_msg(__('An error occurred while saving the file.\nMake sure you have write permissions on the directory.')));
		write.write(content);
		write.close();
		write.on('close', () => show_msg(__('File save correctly')));
		return;
	});
	saveDialog.exec();
});

const show_msg = (text) => {
	const messageBox = new QMessageBox();
	messageBox.setWindowTitle(__('Fantasy Names Generator'));
	messageBox.setText(text);
	const accept = new QPushButton();
	accept.setText(__('Accept'));
	messageBox.addButton(accept, ButtonRole.AcceptRole);
	messageBox.exec();
}