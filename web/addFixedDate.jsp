<div id="divAddDate" data-ng-controller="FixedDateCtrl">
	<h1 class="page-header">Add date</h1>

	<form name="frmFixedDate" novalidate>
		<input type="hidden" name="id" value="12345"/><!-- TODO -->
		<input type="hidden" name="type" value="fixeddates"/>
		<ul class="nav nav-tabs">
			<li id="liGeneral"   role="presentation" class="active">
				<a data-ng-click="showGeneralTab()">General</a>
			</li>
			<li id="liProposals" role="presentation">
				<a data-ng-click="showProposalTab()">Time proposals</a>
			</li>
		</ul>

		<div id="divGeneralWrapper">
			<div class="row">
				<div class="col-md-2">
					<h4>Title*</h4>
				</div>
				<div class="col-md-4">
					<input type="text" name="txtTitle" data-ng-keydown="preventSubmit($event)" data-ng-model="newFixedDate.title" required
						   placeholder="Ex. Our next event"/>
				</div>
			</div>

			<div class="row">
				<div class="col-md-2">
					<h4>Location</h4>
				</div>
				<div class="col-md-4">
					<input type="text" name="txtLocation" data-ng-keydown="preventSubmit($event)" data-ng-model="newFixedDate.location"
						   placeholder="Ex. Hauptstr. 12, 12345 Mainz"/>
				</div>
			</div>

			<div class="row">
				<div class="col-md-2">
					<h4>Description*</h4>
				</div>
				<div class="col-md-4">
					<textarea name="txtDescription" data-ng-model="newFixedDate.description" required></textarea>
				</div>
			</div>

			<div class="row">
				<div class="col-md-2">
				</div>
				<div class="col-md-4">
					<br/>
					<button class="btn btn-default" onclick="window.location.href = '#home'">Cancel</button>
					<button class="btn btn-success pull-right" data-ng-click="showProposalTab()"
							ng-disabled="!frmFixedDate.$valid">Next</button>
				</div>
			</div>
		</div><!-- divGeneralWrapper -->

		<div id="divProposalWrapper">

			<div class="row">
				<div class="calendar col-md-4">
					<div class="panel panel-default">
						<div class="panel-heading">
							Suggest dates for '{{newFixedDate.title}}' in {{newFixedDate.location}}
						</div>
						<h3 class="alert-info">
							<button class="btn btn-primary pull-left" data-ng-click="chgMonth(-1)" data-ng-show="isFutureDate()">&lt;</button>
							{{months[month] + ' ' + year}}
							<button class="btn btn-primary pull-right" data-ng-click="chgMonth(1)">&gt;</button>
						</h3>
						<%@include file="_calendarTable.html"%>
					</div>
				</div><!-- calendar -->

				<div class="selectedDates col-md-4">
					<div class="panel panel-default">
						<div class="panel-heading">Selected dates</div>
						<div class="panel-body">
							<h4 data-ng-show="!isDateSelected()" class="alert alert-success">
								<span class="glyphicon glyphicon-arrow-left"></span><br>
								Please select one or more dates in the calendar on the left<br>
								<span class="glyphicon glyphicon-arrow-left"></span>
							</h4>
							<div id="selection{{i}}" class="selection" data-ng-repeat="i in dummyArrayWith6Entries">
								<span class="glyphicon glyphicon-trash" data-idx="0" data-yyyy_mm_dd=""></span>
								<span class="date">{{selection[$index]}}</span><br/>
								<div class="inputTextWrapper">
									<input type="hidden" name="sel{{$index}}Date"/>
									<input type="text"   name="sel{{$index}}Time1" placeholder="08:00" 
										   data-ng-keyup="validateSave($event)" data-ng-keydown="enableOnlyNumbers($event)"/>
									<input type="text"   name="sel{{$index}}Time2" placeholder="09:00" 
										   data-ng-keyup="validateSave($event)" data-ng-keydown="enableOnlyNumbers($event)"/>
									<input type="text"	 name="sel{{$index}}Time3" placeholder="10:00" 
										   data-ng-keyup="validateSave($event)" data-ng-keydown="enableOnlyNumbers($event)"/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div><!-- row -->
			<div class="row">
				<div class="col-md-4">
					<br/>
					<button class="btn btn-default" data-ng-click="showGeneralTab()">Back</button>
					<button class="btn btn-success pull-right" data-ng-click="saveFixedDate()"
							ng-disabled="!isTimeSelectedAndValid()">Save</button>
				</div>
			</div><!-- row -->

		</div>
	</form>

</div>
