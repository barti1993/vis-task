let data = [
    { "ID": "1", "PROP1": "A", "PROP2": "X", "NAME": "Grid control" },
    { "ID": "1.1", "PROP1": "A", "PROP2": "X", "NAME": "Analysis" },
    { "ID": "1.1.1", "PROP1": "A", "PROP2": "Y", "NAME": "Use cases", "FROM": 20150101, "TO": 20150108 },
    { "ID": "1.1.2", "PROP1": "A", "PROP2": "Y", "NAME": "Business features", "FROM": 20150105, "TO": 20150114 },
    { "ID": "1.2", "PROP1": "B", "PROP2": "Y", "NAME": "Prototype" },
    { "ID": "1.2.1", "PROP1": "B", "PROP2": "Y", "NAME": "Hanlding data", "FROM": 20150116, "TO": 20150324 },
    { "ID": "1.2.2", "PROP1": "B", "PROP2": "Z", "NAME": "Rendering", "FROM": 20150125, "TO": 20150205 },
    { "ID": "1.2.3", "PROP1": "B", "PROP2": "Z", "NAME": "Testable API v1", "FROM": 20150203, "TO": 20150215 },
    { "ID": "1.2.4", "PROP1": "B", "PROP2": "Z", "NAME": "Publish","FROM": 20150212, "TO": 20150229 },
    { "ID": "1.3", "PROP1": "C", "PROP2": "Z", "NAME": "Building V1", "FROM": 20150216, "TO": 20150225 },
    { "ID": "1.4", "PROP1": "C", "PROP2": "Z", "PROP3": "Z", "PROP4": "F", "NAME": "Business features", "FROM": 20150301, "TO": 20150331 }
]

const calculateDate = (id, tempData) => {
    let rangeFrom;
    let rangeTo;
    tempData[id].forEach(obj => {
        let tempFrom;
        let tempTo;
        if(!obj["FROM"] || !obj["TO"]) {
            [tempFrom, tempTo] = calculateDate(obj["ID"], tempData)
        } else {
            tempFrom = obj["FROM"];
            tempTo = obj["TO"];
        }
        if(!rangeFrom || rangeFrom > tempFrom) {
            rangeFrom = tempFrom
        }
        
        if(!rangeTo || rangeTo < tempTo) {
            rangeTo = tempTo
        }
    })
    return [rangeFrom, rangeTo]
}
const createHelperTree = (data) => {
    const treeData = {}
    data.forEach(element => {
        treeData[element["ID"]] = data.filter(obj => {
            let isChild = obj["ID"].startsWith(element["ID"]+'.');
            let childDots = (obj["ID"].match(/\./g) || []).length;
            let parentDots = (element["ID"].match(/\./g) || []).length;
            return isChild && childDots === parentDots + 1;
        })
    });
    return treeData;
} 


const preProcessData = (dataSet) => {
    const treeData = createHelperTree(dataSet);
    dataSet.forEach(element => {
        if (!element["FROM"] || !element["TO"]) {
            let to;
            let from;
            [from, to] = calculateDate(element["ID"], treeData)
            element["FROM"] = from;
            element["TO"] = to;
        }
    })
}

const extractHeaders = (obj) => {
    return Object.keys(obj);
}

const extractHeaderData = (objArr) => {
    let results = new Set();
    objArr.forEach(el => {
        extractHeaders(el).forEach(key => results.add(key));
    })
    return Array.from(results);
}

const createHeaderCol = (text) => {
    const th = document.createElement('th');
    const thText = document.createTextNode(text);
    th.append(thText);
    return th;
}

const createHeader = (keys) => {
    const head = document.createElement("tr");
    keys.forEach(key => head.appendChild(createHeaderCol(key)))
    return head;
}

const createRow = (element, keys) => {
    const returnData = document.createElement("tr");
    keys.forEach(key => {
        if (element[key]) {
            let tempVal;
            tempVal = element[key];
            if (key === "FROM" || key === "TO") {
                tempVal = convertDate(element[key])
            }
            returnData.appendChild(createHeaderCol(tempVal));
        } else {
            returnData.appendChild(document.createElement('th'))
        }
    })
    return returnData;
}

const createContent = (inputData, keys, table) => {
    inputData.forEach(obj => {
        table.appendChild(createRow(obj, keys));
    })
}

const convertDate = (date) => {
    const stringDate = date.toString();
    const year = stringDate.substring(0, 4);
    const month = stringDate.substring(4, 6);
    const day = stringDate.substring(6, 8);

    return new Date(year, parseInt(month)-1, day);
}

preProcessData(data);
const body = document.querySelector("body");
const table = document.createElement("table");
const header = document.createElement("thead");
const keys = extractHeaderData(data);
table.appendChild(createHeader(keys))
createContent(data, keys, table)

body.appendChild(table);