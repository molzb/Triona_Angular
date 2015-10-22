<div class="container" data-ng-controller="HolidayCtrl">
	<h1 class="page-header">Holidays</h1>

	<div class="row">
		<div class="btn-group col-md-4" role="group">
			<button type="button" class="btn btn-primary" data-ng-click="chgYear(-1)">&lt;</button>
			<button type="button" class="btn btn-default" data-ng-click="gotoToday()">Today</button>
			<button type="button" class="btn btn-primary" data-ng-click="chgYear(1)">&gt;</button>
		</div>
	</div>

	<div class="row">&nbsp;</div>
	<div id="listHolidays" class="row">
		<div class="col-md-4 alert alert-success">
			<b>Holidays in {{year}}: </b>{{me.holidays}} days
		</div>
		<div class="col-md-4 alert alert-success">
			<b>Taken in {{year}}: </b>{{takenDays}} days
		</div>
		<div class="col-md-4 alert" data-ng-class="remainingDays > 0 ? 'alert-success' : 'alert-danger'">
			<b>Remaining:</b>{{remainingDays}} days
		</div>
	</div>

	<div class="row">&nbsp;</div>
	<form id="frmHoliday" class="row" action="PutServlet" novalidate>
		<input type="hidden" name="sqlType" value="INSERT"/>
		<input type="hidden" name="type" value="holidays"/>
		<input type="hidden" name="employeeId" value="4"/>
		<div class="col-md-3">
			<div class="input-group date" id="datepickerFrom">
				<input id="fromDate" name="fromDate" type="text" class="form-control" data-ng-model="from" data-ng-blur="updateFrom()"
					   placeholder="First day of your vacation"/>
				<span class="input-group-addon">
					<span class="glyphicon glyphicon-calendar"></span>
				</span>
			</div>
		</div>
		<div class="col-md-3">
			<div class="input-group date" id="datepickerTo">
				<input id="toDate" name="toDate" type="text" class="form-control" data-ng-model="to" data-ng-blur="updateTo()"
					   placeholder="Last day of your vacation" />
				<span class="input-group-addon">
					<span class="glyphicon glyphicon-calendar"></span>
				</span>
			</div>
		</div>
		<div class="col-md-2">
			<span>Working days:</span><span class="label label-default" data-ng-bind="workingDays"></span>
			<input type="hidden" name="workingDays" id="workingDays" data-ng-value="workingDays"/>
		</div>
		<div class="col-md-3">
			<div class="control-group">
				<a class="btn btn-warning" href="/Triona_Angular">Cancel</a>
				<button type="button" class="btn btn-success" data-ng-disabled="remainingDays < 0" data-ng-click="save()">Save</button>
				<button type="reset"  data-ng-click="reset()" class="btn btn-danger">Reset</button>
			</div>
		</div>
		<div class="col-md-1">
			<button title="Show/hide holidays" data-ng-click="toggleHolidayList()" class="btn btn-default" type="button">
				{{holidayListVisible ? 'Hide' : 'Show'}}
				<span id="toggleHolidayList" class="glyphicon glyphicon-list-alt"></span>
			</button>
		</div>
	</form>

	<!-- Tabelle mit bestehendem Urlaub -->
	<div class="row" data-ng-show="myHolidays.length > 0">&nbsp;</div>
	<div id="divExistingHolidays" class="row" data-ng-show="myHolidays.length > 0 && holidayListVisible">
		<table id="tblExistingHolidays" class="table-bordered table table-striped table-hover">
			<thead>
				<tr>
					<th>From</th>
					<th>To</th>
					<th>Workdays</th>
					<th>&nbsp;</th>
				</tr>
			</thead>
			<tbody>
				<tr data-ng-repeat="h in myHolidays">
					<td>{{h.from | date:'dd.MM.yyyy'}}</td>
					<td>{{h.to | date:'dd.MM.yyyy'}}</td>
					<td>{{h.workingDays}}</td>
					<td class="w20">
						<a data-ng-click="delete(h.id)">
							<span class="glyphicon glyphicon-remove" title="Delete this hoiday"></span>
						</a>
					</td>
				</tr>
			</tbody>
		</table>
	</div>

	<!-- Calendar for the year -->
	<div class="row">
		<div class="calendar col-md-4" data-ng-repeat="m in months">
			<h3 class="alert-info">{{m + ' ' + year}}</h3>
			<%@include file="_calendarTable.html"%>
		</div>
	</div>
</div>
