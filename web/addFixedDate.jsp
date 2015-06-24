<div id="divAddDate" ng-controller="FixedDateCtrl">
	<h1 class="page-header">Add date</h1>

	<form name="frmFixedDate" novalidate>
		<ul class="nav nav-tabs">
			<li id="liGeneral"   role="presentation" class="active">
				<a ng-click="showGeneralTab()">General</a>
			</li>
			<li id="liProposals" role="presentation">
				<a ng-click="showProposalTab()">Time proposals</a>
			</li>
		</ul>

		<div id="divGeneralWrapper">
			<div class="row">
				<div class="col-md-2">
					<h4>Title*</h4>
				</div>
				<div class="col-md-4">
					<input type="text" name="txtTitle" ng-model="newFixedDate.title" required
						   placeholder="Ex. Our next event"/>
				</div>
			</div>

			<div class="row">
				<div class="col-md-2">
					<h4>Location</h4>
				</div>
				<div class="col-md-4">
					<input type="text" name="txtLocation" ng-model="newFixedDate.location"
						   placeholder="Ex. Hauptstr. 12, 12345 Mainz"/>
				</div>
			</div>

			<div class="row">
				<div class="col-md-2">
					<h4>Description*</h4>
				</div>
				<div class="col-md-4">
					<textarea name="txtDescription" ng-model="newFixedDate.description" required></textarea>
				</div>
			</div>

			<div class="row">
				<div class="col-md-2">
				</div>
				<div class="col-md-4">
					<br/>
					<button class="btn btn-default" onclick="window.location.href = '#home'">Cancel</button>
					<button class="btn btn-success pull-right" ng-click="showProposalTab()"
							ng-disabled="!frmFixedDate.$valid">Next</button>
				</div>
			</div>
		</div><!-- divGeneralWrapper -->

		<div id="divProposalWrapper">
			<h3>Suggest dates for '{{newFixedDate.title}}' in {{newFixedDate.location}}</h3>

			<div class="row">
				<div class="calendar col-md-4">
					<h3 class="alert-info">
						<button class="btn btn-primary pull-left" ng-click="chgMonth(-1)">&lt;</button>
						{{months[month] + ' ' + year}}
						<button class="btn btn-primary pull-right" ng-click="chgMonth(1)">&gt;</button>
					</h3>
					<%@include file="_calendarTable.html"%>
				</div><!-- calendar -->

				<div class="selectedDates col-md-4 h3" ng-repeat="i in dummyArrayWith6Entries">
					<div id="selection{{i}}">
						<span class="glyphicon glyphicon-trash" data-idx="0" data-day=""></span>
						<span class="date">{{selection[i]}}</span><br/>
						<div class="inputTextWrapper">
							<input type="text" name="sel{{i}}Time1" ng-model="selTime1" placeholder="08:00"/>
							<input type="text" name="sel{{i}}Time2" ng-model="selTime2" placeholder="09:00"/>
							<input type="text" name="sel{{i}}Time3" ng-model="selTime3" placeholder="10:00"/>
						</div>
					</div>
				</div>
			</div><!-- row -->
			<div class="row">
				<div class="col-md-4">
					<br/>
					<button class="btn btn-default" ng-click="showGeneralTab()">Back</button>
					<button class="btn btn-success pull-right" ng-click="saveFixedDate()">Save</button>
				</div>
			</div><!-- row -->

		</div>
	</form>

</div>
