// EDIT HANDLERS AND HELPER FUNCTIONS

// Populate Selects
// getSelectObjects:
// Gets HTML from select objects in the DOM and returns it in an array
// so we can use it in getSelectOptions to populate the edit selects
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

// getSelectOptions:
// Populates edit select elements using the arrays we got with getSelectObjects
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

// Edit button event handler
$(".editBtn").on("click", (e) => {
	e.preventDefault();
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
	let href = $("#url" + uid).attr("href");
	if (typeof href === "undefined") {
		href = "";
		//var url = `<td class="selectedRow"><input id="editUrl${uid}" class="selectedRow" type="text" value="${href}"></td>`;
	} /* else {
		//var url = `<td class="selectedRow"><input id="editUrl${uid}" class="selectedRow" type="text" value=""></td>`;
	} */

	// Build form to insert in place of targeted row
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
				<td class="selectedRow active-icon-cell edit-hidden-row" data-id="edit-details${uid}" >
					<i id="edit-details" class="far fa-edit active-icon" data-id="edit-details${uid}"></i>
				</td>
				<td class="selectedRow active-icon-cell edit-hidden-row" data-id="edit-url${uid}">
					<i id="edit-url" class="far fa-edit active-icon" data-id="edit-url${uid}"></i>
				</td>
				<td class="selectedRow">
					<!-- <input type="submit" id="submitEditBtn" data-uid="${uid}" value="Send" /> -->
					<i id="submitEditBtn" class="fas fa-share" data-uid="${uid}"></i><i class="far fa-trash-alt deleteBtn" data-uid="${uid}"></i>
				</td>`;

	// Build hidden rows for editing details and URL
	const detailsRow = `
		<tr id="edit-details${uid}-row" style="display: none;">
			<td colspan="9" class="selectedRow">
				Details:
				<input id="editDetails${uid}" class="selectedRow" type="text" value="${detailsVal}">
			</td>
		</tr>`;

	const urlRow = `
			<tr id="edit-url${uid}-row" style="display: none;">
				<td colspan="9" class="selectedRow">
					URL:
					<input id="editUrl${uid}" class="selectedRow" type="text" value="${href}">
				</td>
			</tr>
		</form>`;

	targetRow.html(editEls);
	$(detailsRow).insertAfter(targetRow);
	$(urlRow).insertAfter(targetRow);
});

// Show hidden details or url row
$(document).on("click", ".edit-hidden-row", (e) => {
	e.stopImmediatePropagation(); // prevents event bubbling up to parent when triggered by child element
	console.log("show hidden row: " + $(e.target).data("id") + "-row");
	$("#" + $(e.target).data("id") + "-row").toggle();
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

//
$(document).on("click", ".deleteBtn", (e) => {
	e.preventDefault();
	console.log("clicked delete for id = " + $(e.target).data("uid"));
	$.ajax("/delete", {
		type: "POST",
		data: { id: $(e.target).data("uid") },
	}).then((result) => {
		console.log("edit js delete result");
		console.log(result);
		location.reload();
	});
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
