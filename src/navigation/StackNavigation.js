import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

import SplashScreen from "../screens/SplashScreen";
import MainScreen from "../screens/MainScreen";
import RegisterScreen from "../screens/RegisterScreen";
import EditScreen from "../screens/EditScreen";
import AdvisorPortalScreen from "../screens/AdvisorPortalScreen";
import EvaluatorScreen from "../screens/EvaluatorScreen";
import StudentInitialScreen from "../screens/StudentInitialScreen";
import StudentPortalScreen from "../screens/StudentPortalScreen";
import AdminScreen from "../screens/AdminScreen";
import ChatScreenStd from "../screens/ChatScreenStd";
import ChatScreenFact from "../screens/ChatScreenFact";
import ChatScreenFaculty from "../screens/ChatScreenFaculty";
import ChatListFact from "../screens/ChatListFact";
import ProfileFacultyScreen from "../screens/ProfileFactultyScreen";
import AdvisorDisplayScreen from "../screens/DisplayAdvisorScreen";
import FormsScreen from "../screens/FormsScreen";
import GuidelineScreen from "../screens/GuidelineScreen";
import GroupRegistrationScreen from "../screens/GroupRegistrationScreen";
import ProposalSubmissionScreen from "../screens/ProposalSubmissionScreen";
import EditGroupScreen from "../screens/EditGroupScreen";
import ProposalHandleScreen from "../screens/ProposalHandleScreen";
import EmailScreen from "../screens/EmailScreen";
import ScheduleMeetingScreen from "../screens/ScheduleMeetingScreen";
import ViewActiveProjectsScreen from "../screens/ViewActiveProjectsScreen";
import CounsellingHoursScreen from "../screens/CounsellingHoursScreen";
import EditCounsellingScreen from "../screens/EditCounsellingScreen";
import ManageFacultyScreen from "../screens/admin/ManageFacultyScreen";
import ManageStudentScreen from "../screens/admin/ManageStudentScreen";
import AddFacultyExcel from "../screens/admin/AddFacultyExcel";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import ManageGroupScreen from "../screens/admin/ManageGroupScreen";
import AssignEvaluatorScreen from "../screens/advisor/AssignEvaluatorScreen";
import Schedular from "../screens/admin/Schedular";
import ViewReviewScreen from "../screens/ViewReviewScreen";
import RequestMeeting from "../screens/RequestMeeting"
import EnrollStudentScreen from "../screens/admin/EnrollStudentScreen";
import PreviousProposalScreen from "../screens/PrviousProposalsScreen";
import AddFutureFYP from "../screens/admin/AddFutureFYP";
import ViewFutureIdeas from "../screens/ViewFutureIdeas";
import Questionnaire from "../screens/admin/Questionnaire";

import Temp from "../screens/Temp";
import { View } from "react-native";

const Stack = createStackNavigator();

const MyStack = () => {
    return (
        <>
            <StatusBar style="auto" hidden={true}/>
            <Stack.Navigator >
                {/* <Stack.Screen name="Temp" component={Temp} options={{ headerShown: false }} /> */}
                {/* <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} /> */}
                <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
                <Stack.Screen name="AdvisorPortal" component={AdvisorPortalScreen} options={{ headerShown: false }} />
                <Stack.Screen name="StdPortal" component={StudentPortalScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Edit" component={EditScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                <Stack.Screen name="StdInitial" component={StudentInitialScreen} options={{ headerShown: false }} />
                <Stack.Screen name="EvaluatorPortal" component={EvaluatorScreen} options={{ headerShown: false }} />
                <Stack.Screen name="AdminScreen" component={AdminScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ChatScreenStd" component={ChatScreenStd} options={{ headerShown: false }} />
                <Stack.Screen name="ChatScreenFact" component={ChatScreenFact} options={{ headerShown: false }} />
                <Stack.Screen name="ChatScreenFaculty" component={ChatScreenFaculty} options={{ headerShown: false }} />
                <Stack.Screen name="ChatListFact" component={ChatListFact} options={{ headerShown: false }} />
                <Stack.Screen name="ProfileFaculty" component={ProfileFacultyScreen} options={{ headerShown: false }} />
                <Stack.Screen name="AdvisorList" component={AdvisorDisplayScreen} options={{ headerShown: false }} />
                <Stack.Screen name="FormsScreen" component={FormsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="GuidelineScreen" component={GuidelineScreen} options={{ headerShown: false }} />
                <Stack.Screen name="GroupRegistration" component={GroupRegistrationScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ProposalSubmission" component={ProposalSubmissionScreen} options={{ headerShown: false }} />
                <Stack.Screen name="EditGroup" component={EditGroupScreen} options={{headerShown: false}} />
                <Stack.Screen name="ProposalHandle" component={ProposalHandleScreen} options={{ headerShown: false }} />
                <Stack.Screen name="EmailScreen" component={EmailScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ScheduleMeeting" component={ScheduleMeetingScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ViewProjects" component={ViewActiveProjectsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="CounsellingHours" component={CounsellingHoursScreen} options={{ headerShown: false }} />
                <Stack.Screen name="EditCounselling" component={EditCounsellingScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ManageFaculty" component={ManageFacultyScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ManageStudents" component={ManageStudentScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ManageGroups" component={ManageGroupScreen} options={{ headerShown: false }} />
                <Stack.Screen name="AddExcel" component={AddFacultyExcel} options={{ headerShown: false }} />
                <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />
                <Stack.Screen name="AssignEvaluator" component={AssignEvaluatorScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Schedular" component={Schedular} options={{ headerShown: false }} />
                <Stack.Screen name="ViewReview" component={ViewReviewScreen} options={{ headerShown: false }} />
                <Stack.Screen name="RequestMeeting" component={RequestMeeting} options={{ headerShown: false }} />
                <Stack.Screen name="EnrollStudent" component={EnrollStudentScreen} options={{ headerShown: false }} />
                <Stack.Screen name="PreviousProposals" component={PreviousProposalScreen} options={{ headerShown: false }} />
                <Stack.Screen name="AddFutureFYP" component={AddFutureFYP} options={{ headerShown: false }} />
                <Stack.Screen name="ViewFutureIdeas" component={ViewFutureIdeas} options={{ headerShown: false }} />
                <Stack.Screen name="Questionnaire" component={Questionnaire} options={{ headerShown: false }} />

            </Stack.Navigator>
        </>
    );
}

export default MyStack;