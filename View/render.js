import PayoffTable from "./Model/PayoffTable.js"
import Option from "./Model/Option.js"

function renderTitle () {
    let section = document.createElement('section');
    section.classList.add('section');

    let container = document.createElement('div');
    container.classList.add('container');
    section.append(container);

    let title = document.createElement('h1');
    title.classList.add('title', 'has-text-centered');
    title.textContent = 'Options Payoff Generator';
    container.append(title);

    section.append(document.createElement('hr'));
    return section;
}
function getOptionCount() {
    return document.getElementsByClassName('optionLine').length;
}
function renderBuyField () {
    let bsCol = document.createElement('div');
    bsCol.classList.add('column', 'is-narrow');
    
    let field = document.createElement('div');
    field.classList.add('field', 'is-narrow', 'is-horizontal');
    bsCol.append(field);

    let bs_control = document.createElement('div');
    bs_control.classList.add("control");
    field.append(bs_control);

    let bs_input = document.createElement('div');
    bs_input.classList.add("select", 'is-fullwidth');
    bs_control.append(bs_input);

    let options = document.createElement('select');
    options.classList.add('trade');

    let buy = document.createElement('option');
    buy.text = 'BUY';
    options.add(buy);

    let sell = document.createElement('option');
    sell.text = 'SELL';
    options.add(sell);
    
    bs_input.append(options);
    return bsCol;
}
function renderCallField () {
    let cpCol = document.createElement('div');
    cpCol.classList.add('column', 'is-narrow');

    let field = document.createElement('div');
    field.classList.add('field', 'is-narrow', 'is-horizontal');
    cpCol.append(field);

    let cp_control = document.createElement('div');
    cp_control.classList.add("control");
    field.append(cp_control);

    let cp_input = document.createElement('div');
    cp_input.classList.add("select", 'is-fullwidth');
    cp_control.append(cp_input);

    let options = document.createElement('select');
    options.classList.add('trade');

    let call = document.createElement('option');
    call.text = 'CALL';
    options.add(call);

    let put = document.createElement('option');
    put.text = 'PUT';
    options.add(put);
    
    cp_input.append(options);
    return cpCol;
}
function renderStrikeField () {
    let strikeCol = document.createElement('div');
    strikeCol.classList.add('column', 'is-narrow');

    let strike = document.createElement('div');
    strike.classList.add("field", "is-horizontal", 'is-narrow');
    strikeCol.append(strike);

    let strike_control = document.createElement('div');
    strike_control.classList.add("control");
    strike.append(strike_control);

    let strike_input = document.createElement('input');
    strike_input.classList.add("input", 'trade');
    strike_input.placeholder = 'STRIKE';
    strike_control.append(strike_input);
    
    return strikeCol;
}
function renderDelete() {
    let del = document.createElement('div');
    del.classList.add('column', 'is-narrow', 'delete_button');

    let button = document.createElement('button');
    button.classList.add('delete', 'is-large');
    del.append(button);

    button.addEventListener('click', function(ev) {
        del.parentElement.parentElement.remove();

        for(let i = 0; i < document.getElementsByClassName('optionLabel').length; i++) {
            document.getElementsByClassName('optionLabel').item(i).textContent = `Option ${i + 1}`;
        }
    });

    return del;
}
function renderOptionLineDelete() {
    let section = document.createElement('section');
    section.classList.add('optionLine');

    let cols = document.createElement('div');
    cols.classList.add('deleteLine','columns', 'is-centered');
    section.append(cols);

    cols.append(renderOptionNum());
    cols.append(renderBuyField());
    cols.append(renderCallField());
    cols.append(renderStrikeField());
    cols.append(renderDelete());

    return section;
}
function renderOptionNum() {
    let column = document.createElement('div');
    column.classList.add('column', 'is-narrow', 'optionLabel');
    column.textContent = `Option ${getOptionCount() + 1}`;

    return column
}
function renderOptionLine () {

    let section = document.createElement('section');
    section.classList.add('optionLine');

    let cols = document.createElement('div');
    cols.classList.add('columns', 'is-centered');
    section.append(cols);
    
    cols.append(renderOptionNum());
    cols.append(renderBuyField());
    cols.append(renderCallField());
    cols.append(renderStrikeField());

    return section;
}
function renderShareField () {
    let section = document.createElement('section');

    let columns = document.createElement('div');
    columns.classList.add('columns', 'is-centered', 'is-vcentered');
    section.append(columns);

    let column = document.createElement('div');
    column.classList.add("column", "is-narrow");
    column.textContent = `Underlying Shares`;
    columns.append(column);

    column = document.createElement('div');
    column.classList.add('column', 'is-4');
    columns.append(column);

    let field = document.createElement('div');
    field.classList.add('field', 'is-horizontal');
    field.style.width = '90.7%'
    column.append(field);

    let field_control = document.createElement('div');
    field_control.classList.add("control");
    field_control.style.width = '100%'
    field.append(field_control);

    let input = document.createElement('input');
    input.classList.add('input', 'tradeSt');
    input.placeholder = 'Assume 1 Share / Option';
    field_control.append(input);

    return section;
}
function handleOptionButton(ev) {
    document.getElementsByClassName('optionLine').item(document.getElementsByClassName('optionLine').length - 1).after(renderOptionLineDelete());
}
function handleReset(ev) {
    const $root = $('#root');
    $root.empty();
    buildPage();
}
function renderButtons () {
    let section = document.createElement('section');
    section.classList.add('section');

    let buttons = document.createElement('div');
    buttons.classList.add('buttons', 'is-centered');
    section.append(buttons);

    let button = document.createElement('button');
    button.classList.add('button', 'is-link');
    button.textContent = 'Add Option';
    button.addEventListener('click', handleOptionButton);
    buttons.append(button);

    button = document.createElement('button');
    button.classList.add('button', 'is-success');
    button.textContent = 'Generate';
    button.addEventListener('click', handleGenerate);
    buttons.append(button);

    button = document.createElement('button');
    button.classList.add('button', 'is-warning');
    button.textContent = 'Reset';
    button.addEventListener('click', handleReset);
    buttons.append(button);

    return section;
}
function renderAssumptions() {
    let section = document.createElement('section');
    
    let container = document.createElement('div');
    container.classList.add('container');
    section.append(container);

    let content = document.createElement('div');
    content.classList.add('content', 'has-text-centered');
    container.append(content);

    let p = document.createElement('p');
    p.style.fontStyle = 'Italic';
    p.textContent = 'Assume same expiration'
    content.append(p);

    section.append(document.createElement('br'));
    return section;
}
function buildPage () {
    const $root = $('#root');
    $root.append(renderTitle());
    $root.append(renderAssumptions());
    $root.append(renderOptionLine());
    $root.append(renderShareField());
    $root.append(renderButtons());
}
function createTradeStructure() {
    let optionArr = []
    for (let i = 0; i < document.getElementsByClassName('trade').length; i += 3) {
        if (isNaN(document.getElementsByClassName('trade').item(i+2).value)) {
            alert('Strike must be a number');
            return;
        }
        if (document.getElementsByClassName('trade').item(i+2).value <= 0) {
            alert('Strike must be greater than 0');
            return;
        }
        if(isNaN(document.getElementsByClassName('tradeSt').item(0).value)){
            alert('Underlying shares must be a number')
        }
        let option = new Option(document.getElementsByClassName('trade').item(i).value, document.getElementsByClassName('trade').item(i+1).value, document.getElementsByClassName('trade').item(i+2).value);
        optionArr.push(option);
    }
    optionArr.unshift(null);
    
    let st;
    if (document.getElementsByClassName('tradeSt').item(0).value == '') {
        st = '0'
    } else {
        st = document.getElementsByClassName('tradeSt').item(0).value;
    }
    let tradeStructure = {
        Options: optionArr,
        St: st
    }
    return tradeStructure;
}
function handleGenerate(ev) {
    let payoffTable = new PayoffTable();
    let tradeStructure = createTradeStructure();
    payoffTable.setPayoffTable(tradeStructure);

    //Make table
    let section = document.createElement('section');

    let container = document.createElement('div');
    container.classList.add('container');
    section.append(container);

    let table = document.createElement('table');
    table.classList.add('table', 'center', 'has-text-centered','is-striped');
    container.append(table);

    let thead = document.createElement('thead');
    table.append(thead);

    let tr = document.createElement('tr');
    thead.append(tr);

    let th;
    for (let i = 0; i < payoffTable.getPayoffTable()[0].length; i++) {
        if (i == 0) {
            th = document.createElement('th');
            th.textContent = 'Payoffs';
            tr.append(th);
            continue;
        }
        th = document.createElement('th');
        th.textContent = payoffTable.getPayoffTable()[0][i];
        tr.append(th);
    }

    let tfoot = document.createElement('tfoot');
    table.append(tfoot);

    tr = document.createElement('tr');
    tfoot.append(tr);

    for (let i = 0; i < payoffTable.getPayoffTable()[payoffTable.getPayoffTable().length - 1].length; i++) {
        th = document.createElement('th');
        th.textContent = payoffTable.getPayoffTable()[payoffTable.getPayoffTable().length - 1][i];
        tr.append(th);
    }
    
    let tbody = document.createElement('tbody');
    table.append(tbody);
    
    let td;
    for (let i = 1; i < payoffTable.getPayoffTable().length - 1; i++) {
        tr = document.createElement('tr');
        tbody.append(tr);
        for(let j = 0; j < payoffTable.getPayoffTable()[i].length; j++) {
            if (j == 0) {
                th = document.createElement('th');
                th.textContent = payoffTable.getPayoffTable()[i][j];
                th.style.fontWeight = 'bold';
                tr.append(th);
                continue;
            }
            td = document.createElement('td');
            td.textContent = payoffTable.getPayoffTable()[i][j];
            tr.append(td);
        }
    }
    let content = document.createElement('div');
    content.classList.add('content', 'has-text-centered');
    container.append(content);

    let desc = document.createElement('p');
    desc.style.fontStyle = 'italic'
    desc.innerHTML = 'St: Stock price at expiration <br> Payoff: Dollar amount received at expiration <br> Profit: Payoff - Cost of trade';
    content.append(desc);

    if (document.getElementsByTagName('table').length > 0) {
        document.getElementsByTagName('table').item(0).replaceWith(table);
    } else {
        const $root = $('#root');
        $root.append(section);
    }
}
$(function() {
    buildPage();
});