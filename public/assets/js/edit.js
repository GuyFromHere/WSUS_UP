// EDIT HANDLERS AND HELPER FUNCTIONS

// takes select options list and outputs it to edit inputs
// marks the currently selected option as selected in the edit form
const getSelectOptions = function (selectedOpt, optionsArr) {
	let outStr = "";
	for (let i = 0; i < optionsArr.length; i++) {
		if (optionsArr[i].value == selectedOpt) {
			outStr +=
				'<option value="' +
				optionsArr[i].id +
				'" selected>' +
				optionsArr[i].value +
				"</option>";
		} else {
			outStr +=
				'<option value="' + optionsArr[i].id + '">' + optionsArr[i].value + "</option>";
		}
	}
	return outStr;
};

// gets id and value from data-id and value of each option in the indicated select input
const getSelectObjects = (columnName) => {
	const selectChildren = document.getElementById("add" + columnName).childNodes;
	const newArr = [];
	for (let i = 1; i < selectChildren.length; i += 2) {
		const newObj = {
			id: selectChildren[i].dataset.id,
			value: selectChildren[i].text,
		};
		newArr.push(newObj);
	}
	return newArr;
};

// Edit button event handler
// TODO:
// need to get the id field from classification, product, and status tables
// in an object array so we can match them with the selected values and populate select menus
$(".editBtn").on("click", (e) => {
	e.preventDefault();
	console.log("script on click editbtn");
	// loop through select columns and get data-id and values and store them in separate object arrays...active-icon-cell
	const products = getSelectObjects("Product");
	const statuses = getSelectObjects("Status");
	const classifications = getSelectObjects("Classification");
	// get row to update
	const uid = $(e.target).data("uid");
	const targetRow = $("#row" + uid);
	// get current values from the row
	const kbVal = $("#kb" + uid)
		.text()
		.trim();
	const classificationVal = $("#classification" + uid)
		.text()
		.trim();
	const statusVal = $("#status" + uid)
		.text()
		.trim();
	const detailsVal = $("#details" + uid + "-info")
		.text()
		.trim();
	const productVal = $("#product" + uid)
		.text()
		.trim();
	const publishDate = $("#publishDate" + uid)
		.text()
		.trim();
	const researchDate = $("#researchDate" + uid)
		.text()
		.trim();
	const href = $("#url" + uid).attr("href");
	if (typeof href != "undefined") {
		var url = `<td class="selectedRow"><input id="editUrl${uid}" class="selectedRow" type="text" value="${href}"></td>`;
	} else {
		var url = `<td class="selectedRow"><input id="editUrl${uid}" class="selectedRow" type="text" value=""></td>`;
	}

	// insert form in place of the target row
	const editEls =
		`<form id="${uid}" class="editForm">
				<td class="selectedRow"><input type="text" id="editKb${uid}" class="selectedRow" value="${kbVal}"></td>
				<td class="selectedRow">
					<select id="editClassification${uid}"  class="selectedRow">` +
		getSelectOptions(classificationVal, classifications) +
		`</select>
				</td>
				<td class="selectedRow">
					<select id="editStatus${uid}" class="selectedRow">` +
		getSelectOptions(statusVal, statuses) +
		`</select>
				</td>
				<td class="selectedRow">
					<select id="editProduct${uid}" class="selectedRow">` +
		getSelectOptions(productVal, products) +
		`</select>
				</td>
				<td class="selectedRow"><input id="editPublishDate${uid}" class="selectedRow" type="text" value="${publishDate}"></td>
				<td class="selectedRow">${researchDate}</td>
				<td class="selectedRow"><input id="editDetails${uid}" class="selectedRow" type="text" value="${detailsVal}"></td>
				${url}
				<td class="selectedRow"><input type="submit" id="submitEditBtn" data-uid="${uid}" value="Send" /></td>
			</form>`;
	targetRow.html(editEls);
});

// handle keypresses when in edit mode
// submit on Enter, exit on Esc, and edit on anything else.
$(document).on("keypress", ".selectedRow", (e) => {
	e.preventDefault();
	e.stopPropagation();
	const uid = $("#submitEditBtn").data("uid");
	if (e.code == "Enter") {
		updateRow(uid);
	} else {
		e.target.value += e.key;
	}
});

// Handle edit form submission
$(document).on("click", "#submitEditBtn", (e) => {
	e.preventDefault();
	updateRow($(e.target).data("uid"));
});

updateRow = (uid) => {
	const editUpdate = {};
	editUpdate.kb = $("#editKb" + uid).val();
	editUpdate.details = $("#editDetails" + uid).val();
	editUpdate.status = $("#editStatus" + uid).val();
	editUpdate.classification = $("#editClassification" + uid).val();
	editUpdate.product = $("#editProduct" + uid).val();
	editUpdate.publishDate = $("#editPublishDate" + uid).val();
	editUpdate.url = $("#editUrl" + uid).val();
	editUpdate.uid = uid;
	$.ajax("/edit", {
		type: "POST",
		data: editUpdate,
	}).then(() => {
		location.reload();
	});
};
// END EDIT EVENTS
