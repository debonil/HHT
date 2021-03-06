export const Logs = 
   { 
     mfpjsonloaded : 'MFPJSON loaded succesfully' ,
     mfpjsonfailed	: 'MFPJSON FAILED TO LOAD!' ,
     login_success	:'User has successfully logged in with User Name' ,
     login_failure	:'Either UserName or Password is incorrect, Kindly try again with valid UserName and Password.' ,
     SERVICE_UNAVAILABLE :'Please check network & runtime configurations.' ,
     
     coachDetails_loaded :'CoachDetails fetched from server' ,
     coachDetails_failure	:'Failed to load coachDetails from server!' ,
     coach_success_json : 'Coach data loaded from JSONStore',
     coach_failure_json : 'Failed to load coach data from JSONStore',
    coaches_loaded_json : 'Coaches fetched succesfully from JSONStore.',
     coaches_failure_json : 'Failed to fetch coaches from JSONStore.',

      passenger_loaded :'Set of Passengers Loaded Succesfully' ,
      passenger_failure	:'Failed to load passengers from server!!' ,
	    passenger_loaded_json	:'Set of Passengers Loaded Succesfully from JSONStore' ,
      passenger_failure_json :'Failed to fetch set of passengers from JSONStore !!' ,
      passenger_load_failure_json :'Failed to load passengers into JSONStore !!' ,
      passenger_sync_success : 'Data synced succesfully',
      waitlist_failure	:'Failed to load waitlist from server!!' ,

      vacantberth_failure	:'Failed to load vacantberth from server!!' ,
      vacantberth_load_failure_json :'Failed to load vacantberth into JSONStore !!' ,

      eftmaster_failure	:'Failed to load eftmaster from server!!' ,
      eftmaster_load_failure_json :'Failed to load eftmaster into JSONStore !!' ,

      dynamicfare_failure	:'Failed to load dynamicfare from server!!' ,
      dynamicfare_load_failure_json :'Failed to load eftmaster into JSONStore !!' ,

      dropeticket_failure	:'Failed to load dropeticket from server!!' ,
      dropeticket_load_failure_json :'Failed to load eftmaster into JSONStore !!' ,

	 train_loaded	:'User train info fetched from server' ,
	 train_failure	:'Failed to fetch user train info from server !!',
     username_required : 'Username missing. Please enter a valid username.',
     password_required : 'Please enter password.',
     username_pattern : 'This is not a valid username',
     password_invalid : 'password does not exist ',
     PNR_mandatory : 'PNR_NO is a MANDATORY FIELD.',
     REASON_mandatory : 'REASON is a MANDATORY FIELD.',
     NAME_mandatory : 'NAME is a MANDATORY FIELD.',
     AGE_mandatory : 'AGE is a MANDATORY FIELD.',
     COACH_mandatory : 'COACH is a MANDATORY FIELD.',
     partialDownload_failure : 'Either Complete Data has been downloaded or unable to fetch any data',
     sync_beginning : 'Proceeding to sync data from Server',
     sync_call_failed : 'SYNC CALL UNSUCCESFUL !!!',
     backend_sync_success : 'Data synced succesfully to server',
     backend_sync_fail : 'Data sync to server was unsuccesfull ',
     invalid_data : 'Either Train Number or Coach Id is not valid',
     coach_passenger_Data : 'Passenger data fetched for coach',
     connection_lost : 'Connection lost !! Please try again.',
     direct_updates : 'CRIS Direct updates initialisation',
     EFT_update_success : 'EFT data updated succesfully',
     offline_update_success : 'Data updated offline.',
     offline_update_failure : 'Offline data update failed !!.',
     logger_init : 'logger provider initialised',


     ///Chart Messages
     CHART_NOT_LOADED :"Chart not loaed!!",

     unexpected_error : "an unexpected error has occured ",
     network_lost : "network lost at "
}