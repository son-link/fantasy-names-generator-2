
const fs = require('fs');

const __getdata = (race) => {
	if (race == 'orcs') {
		rawdata = fs.readFileSync(__dirname + '/names/orcs.txt', 'UTF-8');
		return rawdata.split(/\r?\n/);
	} else {
		let rawdata = fs.readFileSync(__dirname + '/names/'+race+'.json');
		return JSON.parse(rawdata);	
	}
}

const __dice = (min, max) => {
	return Math.floor(Math.random() * (max - min) ) + min;
}

const __capitalize = (str) => {
	str = str.split(' ');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
	}
	
    return str.join(' ');
}

const __gnome_hafling_earned = (sex) => {
	const data = __getdata('gnomes_hafling_earned');
	let earned = '';
	const n = __dice(0, data.earned_1.length - 1);
	let earned_1 = data['earned_1'][n];
	if (earned_1.indexOf('/') > -1) earned_1 = earned_1.split('/')[__dice(0, 1)];

	const s = __dice(0, data.earned_2.length - 1);
	let earned_2 = data.earned_2[s];
	if (earned_2 == 'man' && sex == 'female') earned_2 = 'lady';

	return earned_1+earned_2
}

module.exports.demons = () => {
	data = __getdata('demons')
	n = __dice(0, data.names_1.length-1);
	s = __dice(0, data.names_2.length-1);
	return data.names_1[n] + data.names_2[s];
}

module.exports.dragons = () => {
	data = __getdata('dragons');
	const __get_name = () => {
		name = data.names[__dice(0,99)]
		if (name.indexOf('/') > -1) {
			name = name.split('/')[__dice(0, 1)]
		}

		return name
	}

	d20 = __dice(1, 20)

	if (d20 == 1) {
		name = __get_name()
	} else if (d20 <= 12) {
		name = __get_name() + __get_name()
	} else if (d20 <= 18) {
		name = __get_name() + __get_name() + __get_name()
	} else {
		name = __get_name() + __get_name() + ' ' + __get_name() + __get_name()
	}

	return __capitalize(name);
}

module.exports.drows = (sex, elfs=false) => {
	data = (!elfs) ? __getdata('drows') : __getdata('elfs');
	d10 = __dice(1, 10);

	const __lastname = () => {
		__d10 = __dice(1, 9)
		if (__d10 <= 3) {
			return data.lastname_1[__dice(0, 29)] + data.lastname_2[__dice(0, 29)];
		} else if (__d10 <= 5) {
			return data.lastname_1[__dice(0, 29)] + data.lastname_2[__dice(0, 29)] + data.lastname_2[__dice(0, 29)]
		} else if (__d10 <= 7) {
			return data.lastname_1[__dice(0, 29)] + data.lastname_2[__dice(0, 29)] + "'" + data.lastname_2[__dice(0, 29)]
		} else {
			return data.lastname_2[__dice(0, 29)] + "'" + data.lastname_1[__dice(0, 29)] + data.lastname_2[__dice(0, 29)];
		}
	}

	if (d10 <= 3) {
		name = data[sex+'_1'][__dice(0, 99)] + data[sex+'_2'][__dice(0,99)];
	} else if (d10 <= 5) {
		name = data[sex+'_1'][__dice(0, 99)] + data[sex+'_2'][__dice(0,99)] + data[sex+'_2'][__dice(0,99)];
	} else if (d10 <= 7) {
		name =  data[sex+'_1'][__dice(0,99)] +  data[sex+'_2'][__dice(0,99)] + "'" +  data[sex+'_2'][__dice(0,99)];
	} else {
		name =  data[sex+'_2'][__dice(0,99)] + "'" +  data[sex+'_1'][__dice(0,99)] +  data[sex+'_2'][__dice(0,99)];
	}

	name = name + ' ' +__lastname();
	return __capitalize(name);
}

module.exports.dwarvens = (sex) => {
	data = __getdata('dwarvens');

	const __get_name = () => {
		name = data.names[__dice(0,99)];
		if (name.indexOf('/') > -1) name = name.split('/')[__dice(0, 1)];
		return name
	}

	let name = '';
	["prefix", sex+"_suffix", "suffixes"].forEach( (d) => {
		newname = data[d][__dice(0, data[d].length - 1)];
		if (newname.indexOf('/') > -1) name = name+newname.split('/')[__dice(0, 1)];
		else name = name+newname;
	});

	return __capitalize(name);
}

module.exports.elfs = () => {
	return this.drows('male', true);
}

module.exports.gnomes = (sex) => {
	data = __getdata(race)
	d20 = __dice(1, 10)
	if (d20 <= 4) {
		name = data.names[__dice(0,39)];
	} else if (d20 <= 7) {
		name = data.names[__dice(0,39)] + data.names[__dice(0,39)];
	} else if (d20 <= 9) {
		name = data.names[__dice(0,39)] + data.names[__dice(0,39)] + ' ' + __gnome_hafling_earned(sex);
	} else {
		name = data.names[__dice(0,39)] + data.names[__dice(0,39)] + data.names[__dice(0,39)];
	}

	return __capitalize(name)
}

module.exports.haflings = (sex) => {
	data = __getdata('haflings');

	const __tofemale = (female) => {
		const size = female.length;
		if (female[size-1] != female[size-2]) female += female[size-1]+'a';
		else female += 'a'
		return female
	}

	d20 = __dice(1, 20);
	if (d20 <= 3) {
		name = data.names[__dice(0,39)];
	} else if (d20 <= 9) {
		name = data.names[__dice(0,39)] + data.names[__dice(0,39)];
	} else if (d20 <= 13) {
		name = data.names[__dice(0,39)] + ' ' +  data.names[__dice(0,39)] + data.names[__dice(0,39)];
	} else if (d20 <= 19) {
		name = data.names[__dice(0,39)] + data.names[__dice(0,39)] + ' ' + data.names[__dice(0,39)] + data.names[__dice(0,39)];
	} else {
		name = data.names[__dice(0,39)] + data.names[__dice(0,39)] + ' ' + __gnome_hafling_earned(sex);
	}

	if (sex == 'female') {
		if (name.indexOf(' ') > -1) {
			female = name.split(' ');
			name = __tofemale(female[0]);
			name = name + ' ' + female[1];
		} else {
			name = __tofemale(name);
		}
	}
	return __capitalize(name);
}

module.exports.orcs = () => {
	const names = __getdata('orcs');
	const n = __dice(0, names.length - 1);
	return __capitalize(names[n]);
}

/*
import json, random

class fng:

	def hafling(self, race, sex='male'):
		data = ____getdata(race)

		def __tofemale(female):
			print(female)
			if female[-1] != female[-2]:
				female = female+female[-1]+'a'
			else:
				female = female + 'a'

			return female

		d20 = __dice(1, 20)
		if d20 <= 3:
			name = data.names[__dice(0,39)]

		elif d20 <= 9:
			name = data.names[__dice(0,39)] + data.names[__dice(0,39)]
		elif d20 <= 13:
			name = data.names[__dice(0,39)] + ' ' +  data.names[__dice(0,39)] + data.names[__dice(0,39)]
		elif d20 <= 19:
			name = data.names[__dice(0,39)] + data.names[__dice(0,39)] + ' ' + data.names[__dice(0,39)] + data.names[__dice(0,39)]
		else:
			name = data.names[__dice(0,39)] + data.names[__dice(0,39)] + ' ' + ____gnome_hafling_earned(sex)

		if sex == 'female':
			if name.find(' ') > -1:
				female = name.split(' ')
				name = __tofemale(female[0])
				name = name + ' ' + female[1]
			else:
				name = __tofemale(name)
		return name

	def orcs(self, race):
		f = open('names/orcs.txt')
		names = f.readlines()
		f.close()
		n = __dice(0, len(names[1:]))
		return names[n].strip()


	def gnome(self, race, sex='male'):
		data = ____getdata(race)
		d20 = __dice(1, 10)
		if d20 <= 4:
			name = data.names[__dice(0,39)]
		elif d20 <= 7:
			name = data.names[__dice(0,39)] + data.names[__dice(0,39)]
		elif d20 <= 9:
			name = data.names[__dice(0,39)] + data.names[__dice(0,39)] + ' ' + ____gnome_hafling_earned(sex)
		else:
			name = data.names[__dice(0,39)] + data.names[__dice(0,39)] + data.names[__dice(0,39)]

		return name.capitalize()

	def 

""""if __name__ == "__main__":
	fng = fng()
	for i in range(1, 50):
		print fng.gnome('gnome', 'female')"""
*/