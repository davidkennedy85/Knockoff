'use strict';

function Test(name, func) {
    this.name = name;
    this.func = func;
    this.testContainer = undefined;
}

Test.prototype.addCheckboxInput = function (mapping) {
    var el = document.createElement('input');
    el.dataset.mapping = mapping;
    el.type = 'checkbox';
    this.testContainer.appendChild(el);
    return el;
};

Test.prototype.addSelect = function (mapping, options) {
    var el = document.createElement('select');
    el.dataset.mapping = mapping;
    el.innerHTML = '<option value="">Select one...</option>';
    options.forEach(option => {
        el.innerHTML += '<option value="' + option + '">' + option + '</option>';
    });
    this.testContainer.appendChild(el);
    return el;
};

Test.prototype.addSpan = function (mapping) {
    var el = document.createElement('span');
    el.dataset.mapping = mapping;
    this.testContainer.appendChild(el);
    return el;
};

Test.prototype.addTextarea = function (mapping) {
    var el = document.createElement('textarea');
    el.dataset.mapping = mapping;
    this.testContainer.appendChild(el);
    return el;
};

Test.prototype.addTextInput = function (mapping) {
    var el = document.createElement('input');
    el.dataset.mapping = mapping;
    el.type = 'text';
    this.testContainer.appendChild(el);
    return el;
};

Test.prototype.assertEqual = function (val1, val2) {
    if (val1 !== val2) {
        throw new Error('Expected ' + val2 + ' but was ' + val1);
    }
};

Test.prototype.renderPass = function () {
    var el = document.createElement('div');
    el.className = 'success m-1 p-1 round';
    el.innerHTML = `&#x2713; ${this.name} passed`;
    document.body.appendChild(el);
    return el;
};

Test.prototype.renderFail = function (err) {
    var el = document.createElement('div');
    el.className = 'error m-1 p-1 round';
    el.innerHTML = `&#x2717; ${this.name} failed - ${err.name}: ${err.message} (see console for stack trace)`;
    document.body.appendChild(el);
    return el;
};

Test.prototype.run = function () {
    this.testContainer = document.createElement('div');
    this.testContainer.style.display = 'none';
    document.body.appendChild(this.testContainer);

    try {
        this.func.call(this);
        this.renderPass();
    } catch (err) {
        console.error(err);
        this.renderFail(err);
    }

    this.testContainer.remove();
};

Test.prototype.setElementValue = function (el, newValue) {
    switch (el.type) {
        case 'text':
        case 'textarea':
        case 'select-one':
            el.value = newValue === undefined ? '' : newValue;
            break;
        case 'checkbox':
            el.checked = newValue === undefined ? false : newValue;
            break;
        default:
            el.innerHTML = newValue === undefined ? '' : newValue;
    }

    el.dispatchEvent(new Event('change', {
        bubbles: true
    }));
};

function TestSuite() {
    this.tests = [];
}

TestSuite.prototype.addTest = function (test) {
    this.tests.push(test);
};

TestSuite.prototype.run = function () {
    this.tests.forEach(test => test.run());
};

var allTests = new TestSuite();

allTests.addTest(new Test('testBind', function () {
    var nameSpan = this.addSpan('name');
    var nameInput = this.addTextInput('name');
    var levelInput = this.addTextInput('level');
    var undeadInput = this.addCheckboxInput('undead');
    var raceSelect = this.addSelect('race', ['Human', 'Klingon', 'Vulcan']);
    var descriptionTextarea = this.addTextarea('description');
    var skillsProgrammingDayInput = this.addTextInput('skills.programming.day');
    var skillsProgrammingNightInput = this.addTextInput('skills.programming.night');
    var skillsUnderwaterBasketWeavingDayInput = this.addTextInput('skills.underwaterBasketWeaving.day');
    var skillsUnderwaterBasketWeavingNightInput = this.addTextInput('skills.underwaterBasketWeaving.night');
    var powers0NameInput = this.addTextInput('powers.0.name');
    var powers0DescriptionInput = this.addTextInput('powers.0.description');
    var powers1NameInput = this.addTextInput('powers.1.name');
    var powers1DescriptionInput = this.addTextInput('powers.1.description');

    var model = {
        name: 'Dave',
        level: 10,
        undead: true,
        race: 'Human',
        description: 'As a young boy, Dave created lego masterpieces and wrestled alligators. This is why he only has one arm...',
        skills: {
            programming: { day: 10, night: 20 },
            underwaterBasketWeaving: { day: 1, night: 2 }
        },
        powers: [
            { name: 'Flurry of Keystrokes', description: 'You can type up to 80 word per minute.' },
            { name: 'Telekenesis', description: 'You can move a pebble-sized object with your brain once per day.' }
        ]
    };

    KO.bind(model);

    this.assertEqual(nameSpan.innerHTML, 'Dave');
    this.assertEqual(nameInput.value, 'Dave');
    this.assertEqual(levelInput.value, '10');
    this.assertEqual(undeadInput.checked, true);
    this.assertEqual(raceSelect.value, 'Human');
    this.assertEqual(descriptionTextarea.value, 'As a young boy, Dave created lego masterpieces and wrestled alligators. This is why he only has one arm...');
    this.assertEqual(skillsProgrammingDayInput.value, '10');
    this.assertEqual(skillsProgrammingNightInput.value, '20');
    this.assertEqual(skillsUnderwaterBasketWeavingDayInput.value, '1');
    this.assertEqual(skillsUnderwaterBasketWeavingNightInput.value, '2');
    this.assertEqual(powers0NameInput.value, 'Flurry of Keystrokes');
    this.assertEqual(powers0DescriptionInput.value, 'You can type up to 80 word per minute.');
    this.assertEqual(powers1NameInput.value, 'Telekenesis');
    this.assertEqual(powers1DescriptionInput.value, 'You can move a pebble-sized object with your brain once per day.');

    KO.unbind();
}));

allTests.addTest(new Test('testSpan', function () {
    var nameSpan = this.addSpan('name');

    var model = {
        name: 'Dave'
    };

    KO.bind(model);

    this.setElementValue(nameSpan, 'Ruth');
    this.assertEqual(model.name, 'Ruth');

    model.name = 'Sarah';
    this.assertEqual(nameSpan.innerHTML, 'Sarah');

    KO.unbind();
}));

allTests.addTest(new Test('testTextInput', function () {
    var nameInput = this.addTextInput('name');

    var model = {
        name: 'Dave'
    };

    KO.bind(model);

    this.setElementValue(nameInput, 'Steve');
    this.assertEqual(model.name, 'Steve');

    model.name = 'Bob';
    this.assertEqual(nameInput.value, 'Bob');

    KO.unbind();
}));

allTests.addTest(new Test('testNumericInput', function () {
    var levelInput = this.addTextInput('level');

    var model = {
        level: 10
    };

    KO.bind(model);

    this.setElementValue(levelInput, '12');
    this.assertEqual(model.level, 12);

    model.level = 14;
    this.assertEqual(levelInput.value, '14');

    KO.unbind();
}));

allTests.addTest(new Test('testCheckboxInput', function () {
    var undeadInput = this.addCheckboxInput('undead');

    var model = {
        undead: true
    };

    KO.bind(model);

    this.setElementValue(undeadInput, false);
    this.assertEqual(model.undead, false);

    model.undead = true;
    this.assertEqual(undeadInput.checked, true);

    KO.unbind();
}));

allTests.addTest(new Test('testSelect', function () {
    var raceSelect = this.addSelect('race', ['Human', 'Klingon', 'Vulcan']);

    var model = {
        race: 'Human'
    };

    KO.bind(model);

    this.setElementValue(raceSelect, 'Klingon');
    this.assertEqual(model.race, 'Klingon');

    model.race = 'Vulcan';
    this.assertEqual(raceSelect.value, 'Vulcan');

    KO.unbind();
}));

allTests.addTest(new Test('testTextarea', function () {
    var descriptionTextarea = this.addTextarea('description');

    var model = {
        description: 'As a young boy, Dave created lego masterpieces and wrestled alligators. This is why he only has one arm...'
    };

    KO.bind(model);

    this.setElementValue(descriptionTextarea, 'I am a banana!');
    this.assertEqual(model.description, 'I am a banana!');

    model.description = 'Blah blah blah...';
    this.assertEqual(descriptionTextarea.value, 'Blah blah blah...');

    KO.unbind();
}));

allTests.addTest(new Test('testNested', function () {
    var skillsProgrammingDayInput = this.addTextInput('skills.programming.day');

    var model = {
        skills: {
            programming: { day: 10, night: 20 },
            underwaterBasketWeaving: { day: 1, night: 2 }
        }
    };

    KO.bind(model);

    this.setElementValue(skillsProgrammingDayInput, 12);
    this.assertEqual(model.skills.programming.day, 12);

    model.skills.programming.day = 14;
    this.assertEqual(skillsProgrammingDayInput.value, '14');

    KO.unbind();
}));

allTests.addTest(new Test('testArray', function () {
    var powers0NameInput = this.addTextInput('powers.0.name');

    var model = {
        powers: [
            { name: 'Flurry of Keystrokes', description: 'You can type up to 80 word per minute.' },
            { name: 'Telekenesis', description: 'You can move a pebble-sized object with your brain once per day.' }
        ]
    };

    KO.bind(model);

    this.setElementValue(powers0NameInput, 'Mental Domination');
    this.assertEqual(model.powers[0].name, 'Mental Domination');

    model.powers[0].name = 'Ninja Flipping';
    this.assertEqual(powers0NameInput.value, 'Ninja Flipping');

    KO.unbind();
}));

allTests.addTest(new Test('testUnbind', function () {
    var nameInput = this.addTextInput('name');

    var model = {
        name: 'Dave'
    };

    KO.bind(model);

    var listenerCalled = false;
    KO.listen('name', function (event) {
        listenerCalled = true;
    });

    var validatorCalled = false;
    KO.validate('name', function (event) {
        validatorCalled = true;
    });

    KO.unbind();

    this.setElementValue(nameInput, 'Steve');
    this.assertEqual(model.name, 'Dave');

    model.name = 'Bob';
    this.assertEqual(nameInput.value, 'Steve');

    this.assertEqual(listenerCalled, false);
    this.assertEqual(validatorCalled, false);
}));

allTests.addTest(new Test('testListen', function () {
    var nameInput = this.addTextInput('name');

    var model = {
        name: 'Dave'
    };

    KO.bind(model);

    var eventDetail;
    KO.listen('name', function (event) {
        eventDetail = event.detail;
    });

    model.name = 'Bob';
    this.assertEqual(eventDetail.mapping, 'name');
    this.assertEqual(eventDetail.newValue, 'Bob');
    this.assertEqual(eventDetail.oldValue, 'Dave');

    this.setElementValue(nameInput, 'Steve');
    this.assertEqual(eventDetail.mapping, 'name');
    this.assertEqual(eventDetail.newValue, 'Steve');
    this.assertEqual(eventDetail.oldValue, 'Bob');

    KO.unbind();
}));

allTests.addTest(new Test('testListenArray', function () {
    var nameInput = this.addTextInput('name');
    var levelInput = this.addTextInput('level');

    var model = {
        name: 'Dave',
        level: 10
    };

    KO.bind(model);

    var eventDetail;
    KO.listen(['name', 'level'], function (event) {
        eventDetail = event.detail;
    });

    model.name = 'Bob';
    this.assertEqual(eventDetail.mapping, 'name');
    this.assertEqual(eventDetail.newValue, 'Bob');
    this.assertEqual(eventDetail.oldValue, 'Dave');

    model.level = 12;
    this.assertEqual(eventDetail.mapping, 'level');
    this.assertEqual(eventDetail.newValue, 12);
    this.assertEqual(eventDetail.oldValue, 10);

    this.setElementValue(nameInput, 'Steve');
    this.assertEqual(eventDetail.mapping, 'name');
    this.assertEqual(eventDetail.newValue, 'Steve');
    this.assertEqual(eventDetail.oldValue, 'Bob');

    this.setElementValue(levelInput, 14);
    this.assertEqual(eventDetail.mapping, 'level');
    this.assertEqual(eventDetail.newValue, 14);
    this.assertEqual(eventDetail.oldValue, 12);

    KO.unbind();
}));

allTests.addTest(new Test('testListenRegExp', function () {
    var skillsProgrammingDayInput = this.addTextInput('skills.programming.day');
    var skillsUnderwaterBasketWeavingDayInput = this.addTextInput('skills.underwaterBasketWeaving.day');

    var model = {
        skills: {
            programming: { day: 10, night: 20 },
            underwaterBasketWeaving: { day: 1, night: 2 }
        }
    };

    KO.bind(model);

    var eventDetail;
    KO.listen(/skills\.(.*)\.day/, function (event, match) {
        eventDetail = event.detail;
    });

    model.skills.programming.day = 12;
    this.assertEqual(eventDetail.mapping, 'skills.programming.day');
    this.assertEqual(eventDetail.newValue, 12);
    this.assertEqual(eventDetail.oldValue, 10);

    model.skills.underwaterBasketWeaving.day = 2;
    this.assertEqual(eventDetail.mapping, 'skills.underwaterBasketWeaving.day');
    this.assertEqual(eventDetail.newValue, 2);
    this.assertEqual(eventDetail.oldValue, 1);

    this.setElementValue(skillsProgrammingDayInput, 14);
    this.assertEqual(eventDetail.mapping, 'skills.programming.day');
    this.assertEqual(eventDetail.newValue, 14);
    this.assertEqual(eventDetail.oldValue, 12);

    this.setElementValue(skillsUnderwaterBasketWeavingDayInput, 4);
    this.assertEqual(eventDetail.mapping, 'skills.underwaterBasketWeaving.day');
    this.assertEqual(eventDetail.newValue, 4);
    this.assertEqual(eventDetail.oldValue, 2);

    KO.unbind();
}));

allTests.addTest(new Test('testValidate', function () {
    var nameInput = this.addTextInput('name');

    var model = {
        name: 'Dave'
    };

    KO.bind(model);

    var eventDetail;
    KO.validate('name', function (event) {
        eventDetail = event.detail;
        return false;
    });

    model.name = 'Bob';
    this.assertEqual(eventDetail.mapping, 'name');
    this.assertEqual(eventDetail.newValue, 'Bob');
    this.assertEqual(eventDetail.oldValue, 'Dave');
    this.assertEqual(model.name, 'Dave');
    this.assertEqual(nameInput.value, 'Dave');

    this.setElementValue(nameInput, 'Steve');
    this.assertEqual(eventDetail.mapping, 'name');
    this.assertEqual(eventDetail.newValue, 'Steve');
    this.assertEqual(eventDetail.oldValue, 'Dave');
    this.assertEqual(model.name, 'Dave');
    this.assertEqual(nameInput.value, 'Dave');

    KO.unbind();
}));

allTests.addTest(new Test('testValidateArray', function () {
    var nameInput = this.addTextInput('name');
    var levelInput = this.addTextInput('level');

    var model = {
        name: 'Dave',
        level: 10
    };

    KO.bind(model);

    var eventDetail;
    KO.validate(['name', 'level'], function (event) {
        eventDetail = event.detail;
        return false;
    });

    model.name = 'Bob';
    this.assertEqual(eventDetail.mapping, 'name');
    this.assertEqual(eventDetail.newValue, 'Bob');
    this.assertEqual(eventDetail.oldValue, 'Dave');
    this.assertEqual(model.name, 'Dave');
    this.assertEqual(nameInput.value, 'Dave');

    model.level = 12;
    this.assertEqual(eventDetail.mapping, 'level');
    this.assertEqual(eventDetail.newValue, 12);
    this.assertEqual(eventDetail.oldValue, 10);
    this.assertEqual(model.level, 10);
    this.assertEqual(levelInput.value, '10');

    this.setElementValue(nameInput, 'Steve');
    this.assertEqual(eventDetail.mapping, 'name');
    this.assertEqual(eventDetail.newValue, 'Steve');
    this.assertEqual(eventDetail.oldValue, 'Dave');
    this.assertEqual(model.name, 'Dave');
    this.assertEqual(nameInput.value, 'Dave');

    this.setElementValue(levelInput, 14);
    this.assertEqual(eventDetail.mapping, 'level');
    this.assertEqual(eventDetail.newValue, 14);
    this.assertEqual(eventDetail.oldValue, 10);
    this.assertEqual(model.level, 10);
    this.assertEqual(levelInput.value, '10');

    KO.unbind();
}));

allTests.addTest(new Test('testValidateRegExp', function () {
    var skillsProgrammingDayInput = this.addTextInput('skills.programming.day');
    var skillsUnderwaterBasketWeavingDayInput = this.addTextInput('skills.underwaterBasketWeaving.day');

    var model = {
        skills: {
            programming: { day: 10, night: 20 },
            underwaterBasketWeaving: { day: 1, night: 2 }
        }
    };

    KO.bind(model);

    var eventDetail;
    KO.validate(/skills\.(.*)\.day/, function (event, match) {
        eventDetail = event.detail;
        return false;
    });

    model.skills.programming.day = 12;
    this.assertEqual(eventDetail.mapping, 'skills.programming.day');
    this.assertEqual(eventDetail.newValue, 12);
    this.assertEqual(eventDetail.oldValue, 10);
    this.assertEqual(model.skills.programming.day, 10);
    this.assertEqual(skillsProgrammingDayInput.value, '10');

    model.skills.underwaterBasketWeaving.day = 2;
    this.assertEqual(eventDetail.mapping, 'skills.underwaterBasketWeaving.day');
    this.assertEqual(eventDetail.newValue, 2);
    this.assertEqual(eventDetail.oldValue, 1);
    this.assertEqual(model.skills.underwaterBasketWeaving.day, 1);
    this.assertEqual(skillsUnderwaterBasketWeavingDayInput.value, '1');

    this.setElementValue(skillsProgrammingDayInput, 14);
    this.assertEqual(eventDetail.mapping, 'skills.programming.day');
    this.assertEqual(eventDetail.newValue, 14);
    this.assertEqual(eventDetail.oldValue, 10);
    this.assertEqual(model.skills.programming.day, 10);
    this.assertEqual(skillsProgrammingDayInput.value, '10');

    this.setElementValue(skillsUnderwaterBasketWeavingDayInput, 4);
    this.assertEqual(eventDetail.mapping, 'skills.underwaterBasketWeaving.day');
    this.assertEqual(eventDetail.newValue, 4);
    this.assertEqual(eventDetail.oldValue, 1);
    this.assertEqual(model.skills.underwaterBasketWeaving.day, 1);
    this.assertEqual(skillsUnderwaterBasketWeavingDayInput.value, '1');

    KO.unbind();
}));

allTests.run();
