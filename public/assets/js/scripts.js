$(function () {
	// Check uri for filter or sort values so we can
	// include them in a GET request
	const parseUriParams = (paramType) => {
		const paramString = window.location.search;
		const urlParams = new URLSearchParams(paramString);
		if (urlParams.has(paramType + "Col")) {
			let paramObj = {};
			eval("paramObj." + paramType + "Col = urlParams.get('" + paramType + "Col')");
			eval("paramObj." + paramType + "Val = urlParams.get('" + paramType + "Val')");
			return paramObj;
		} else {
			return null;
		}
	};

	// user clicks td element, get sibling td elements and change their class
	const selectRow = function (target) {
		const siblings = target.siblings("td");
		$(".selectedRow").removeClass("selectedRow");
		target.addClass("selectedRow");
		siblings.addClass("selectedRow");
	};

	// Get new update info and post to /add
	$(".addBtn").on("click", (e) => {
		e.preventDefault();
		const newUpdate = {};
		newUpdate.kb = $("#addKb").val();
		newUpdate.classification = $("#addClassification").val();
		newUpdate.status = $("#addStatus").val();
		newUpdate.details = $("#addDetails").val();
		newUpdate.product = $("#addProduct").val();
		newUpdate.publishDate = $("#addPublishDate").val();
		newUpdate.url = $("#addUrl").val();
		$.ajax("/add", {
			type: "POST",
			data: newUpdate,
		}).then(() => {
			location.reload();
		});
	});

	$(".sortImg").on("click", (e) => {
		e.preventDefault();

		// set default sort direction
		let direction;
		let uriString = "?";
		// get filter parameter if set
		const filterObj = parseUriParams("filter");

		// Set sort direction depending on current class
		if ($(e.target).hasClass("desc")) {
			direction = "desc";
		} else if ($(e.target).hasClass("asc")) {
			direction = "asc";
		} else {
			$(e.target).addClass("desc");
		}
		// default sort is asc
		if (typeof direction === "undefined") direction = "asc";
		// put sort parameters in query object
		queryObj = {
			sortCol: $(e.target).data("col"),
			sortVal: direction,
		};
		uriString += "sortCol=" + queryObj.sortCol + "&sortVal=" + queryObj.sortVal;
		if (filterObj) {
			queryObj.filterCol = filterObj.filterCol;
			queryObj.filterVal = filterObj.filterVal;
			uriString += "&filterCol=" + queryObj.filterCol + "&filterVal=" + queryObj.filterVal;
		}
		$.ajax("/", {
			type: "GET",
			data: queryObj,
		}).then(() => {
			location.href = uriString;
		});
	});

	// check and hide elements that don't contain the desired value
	$(".filterSelect").on("change", (e) => {
		e.preventDefault();
		let uriString = "?";
		// value to filter by
		const filterValue = $(e.target).val().toLowerCase();
		const filterColumn = $(e.target).attr("id").split("-")[1].toLowerCase();
		const queryObj = {
			filterCol: filterColumn,
			filterVal: filterValue,
		};
		uriString += "filterCol=" + queryObj.filterCol + "&filterVal=" + queryObj.filterVal;
		// get sort parameter if set
		const sortObj = parseUriParams("sort");
		if (sortObj) {
			queryObj.sortCol = sortObj.sortCol;
			queryObj.sortVal = sortObj.sortVal;
			uriString += "&sortCol=" + queryObj.sortCol + "&sortVal=" + queryObj.sortVal;
		}
		$.ajax("/", {
			type: "GET",
			data: queryObj,
		}).then((result) => {
			location.href = uriString;
		});
	});

	// Submit search when button is clicked.
	$("#searchBtn").on("click", (e) => {
		let uriString = "?";
		const queryObj = {
			filterCol: "u.kb",
			filterVal: $("#search").val() + "%",
		};
		console.log(queryObj);
		$.ajax("/", {
			type: "GET",
			data: queryObj,
		}).then((result) => {
			uriString += "filterCol=u.kb&filterVal=" + $("#search").val();
			location.href = uriString;
		});
	});

	// Dynamic search as input is filled in...under construction!
	$("#search").on("input", (e) => {
		let uriString = "?";
		const queryObj = {
			filterCol: "u.kb",
			filterVal: $("#search").val() + "%",
		};
		console.log(queryObj);
		$.ajax("/search", {
			type: "GET",
			data: queryObj,
		}).then((result) => {
			console.log("search result = ");
			console.log(result);
			uriString += "filterCol=u.kb&filterVal=" + $("#search").val();
			//location.href = uriString;
		});
	});

	// toggle details row
	$(".active-icon, .active-icon-cell").on("click", (e) => {
		e.stopImmediatePropagation(); // prevents event bubbling up to parent when triggered by child element
		$("#" + $(e.target).data("id") + "-row").toggle();
	});

	// toggle add details / URL rows
	$(".active-icon-cell-add").on("click", (e) => {
		e.stopImmediatePropagation(); // prevents event bubbling up to parent when triggered by child element
		$("#" + $(e.target).attr("id") + "-row").toggle();
	});

	// Process bulk add text
	$("#bulkSubmitBtn").on("click", (e) => {
		e.preventDefault();
		const csv = $("#bulkEditText").val().trim();
		const bulkText = $.csv.toArrays(csv);
		const newUpdateArr = bulkText.map((item) => {
			const newUpdate = {};
			newUpdate.kb = item[0];
			newUpdate.classification = item[1];
			newUpdate.status = item[2];
			newUpdate.details = item[3];
			newUpdate.product = item[4];
			newUpdate.publishDate = item[5];
			newUpdate.url = item[6];
			return newUpdate;
		});
		$.ajax("/bulkAdd", {
			type: "POST",
			data: { bulkData: newUpdateArr },
		}).then((result) => {
			console.log("bulkAdd result = ");
			console.log(result);
			location.href = "/";
		});
	});
});
