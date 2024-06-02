// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import {IUserNFT} from "./interfaces/IUserNFT.sol";
import {AutomationRegistrarInterface} from "./interfaces/AutomationRegistrarInterface.sol";
import {INutritionistNFT} from "./interfaces/INutritionistNFT.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

error AlreadyAMember();

error AlreadyANutrionist();

error InsufficientPayment();

error InvalidApplicant();

error UnauthorizedApplication(string message);

error UnauthorizedNutritionist(address caller);

error UnauthorizedMember(address caller);

error InvalidDeadline();

error InvalidSubStatus();

contract CommunityNetwork is Ownable {
    LinkTokenInterface public immutable i_link;
    AutomationRegistrarInterface public immutable i_registrar;

    using Counters for Counters.Counter;

    Counters.Counter private _applicantIndexCounter;
    Counters.Counter private _userIndexCounter;
    Counters.Counter private communityIdCounter;

    INutritionistNFT public nutritionistNFT;

    IUserNFT public userNFT;

    mapping(address => uint256) public applicantToIndex;

    mapping(address => uint256) public userToIndex;

    mapping(address => Community) public userToCommunity;

    mapping(uint256 => Community) public idToCommunity;

    uint256 public constant userApplicationFee = 0.01 ether;

    uint256 public constant nutritionistApplicationFee = 0.005 ether;

    uint256 public subscriptionDuration = 2592000;

    address public immutable treasury;

    address[] public allUserAddresses;

    address[] public allNutritionistsAddresses;

    address[] public allNutritionistsApplicants;

    mapping(address => bool) isMember;

    mapping(address => bool) isNutritionist;

    mapping(address => User) users;

    mapping(address => Nutritionist) public nutritionists;

    mapping(address => NutritionistApplicationStatus)
        public nutritionistApplicationStatus;

    mapping(address => NutritionistApplication) public nutritionistApplications;

    event NewApplication(address applicant, string dataURI);

    event NewSignUp(address user, string dataURI);

    event ApplicationApproved(address applicant);

    event MintUserNFT(address member);

    event BurnUserNFT(address member, uint256 tokenId);

    event MintNutritionistNFT(address nutritionist);

    event BurnNutritionistNFT(address member, uint256 tokenId);

    enum NutritionistApplicationStatus {
        NotApplied,
        Pending,
        Accepted,
        Rejected,
        Canceled
    }

    enum UserSubscriptionStatus {
        NotActive,
        Active,
        Expired
    }

    struct Community {
        uint256 id;
        string name;
        string communityDescription;
        address[] members;
    }

    Community[] public allCommunities;

    struct NutritionistApplication {
        string dataURI;
        address nutritionistAddress;
        NutritionistApplicationStatus applicationStatus;
    }

    NutritionistApplication[] public allNutritionistsApplications;

    struct MealPlans {
        string mealName;
        string mealDescription;
        address creator;
    }

    MealPlans[] public allMealPlans;

    struct FitnessPlans {
        string name;
        string fitnessDescription;
        address creator;
    }

    FitnessPlans[] public allFitnessPlans;

    struct ConsultationServices {
        address consultant;
        string consultationDescription;
    }

    struct User {
        address userAddress;
        string userPersonalData; //needs to be encrypted before storing
        UserSubscriptionStatus subStatus;
        uint256 subDeadline;
    }

    User[] public allUsers; //update users here

    struct Nutritionist {
        string nutritionistPersonalData; //needs to be encrypted before storing
        MealPlans[] nutritionistMealplans;
        address nutritionistAddress;
        FitnessPlans[] fitnessPlans;
        ConsultationServices consultationServices;
        Articles[] nutritionistArticles;
    }

    Nutritionist[] public allNutritionists;

    struct Articles {
        string title;
        address author;
        string authorName;
        string content;
    }

    Articles[] public allArticles;

    constructor(
        address _treasury,
        LinkTokenInterface link,
        AutomationRegistrarInterface registrar
    ) {
        treasury = _treasury;
        communityIdCounter.increment();
        i_link = link;
        i_registrar = registrar;
    }

    /// @notice Restrict access to trusted `nutritionists`
    modifier onlyNutritionists() {
        if (!isNutritionist[msg.sender]) {
            revert UnauthorizedNutritionist(msg.sender);
        }
        _;
    }

    /// @notice Restrict access to trusted `members`
    modifier onlyMembers() {
        if (isMember[msg.sender]) {
            revert UnauthorizedMember(msg.sender);
        }
        _;
    }

    modifier applicantExists(address _applicant) {
        NutritionistApplicationStatus applicationStatus = nutritionistApplicationStatus[
                _applicant
            ];

        if (applicationStatus != NutritionistApplicationStatus.Pending) {
            revert InvalidApplicant();
        }
        _;
    }

    modifier deadlinePassed(address _member) {
        uint256 deadline = users[_member].subDeadline;

        if (block.timestamp < deadline) {
            revert InvalidDeadline();
        }
        _;
    }

    function setNFTs(
        address _userNFT,
        address _nutritionistNFT
    ) public onlyOwner {
        userNFT = IUserNFT(_userNFT);
        nutritionistNFT = INutritionistNFT(_nutritionistNFT);
    }

    function registerUser(
        string memory _userData,
        string memory nftUri
    ) external payable {
        // Check that sender isn't a member already
        if (isMember[msg.sender]) {
            revert AlreadyAMember();
        }

        if (msg.value < userApplicationFee) {
            revert InsufficientPayment();
        }

        uint256 index = _userIndexCounter.current();
        isMember[msg.sender] = true;
        User memory user = users[msg.sender];
        user.userAddress = msg.sender;
        user.userPersonalData = _userData;
        user.subStatus = UserSubscriptionStatus.Active;
        user.subDeadline = block.timestamp + subscriptionDuration;
        users[msg.sender] = user;
        userToIndex[msg.sender] = index;
        allUsers.push(user);
        allUserAddresses.push(msg.sender);

        //mint userNft for the user
        userNFT.mint(msg.sender, nftUri);
        emit MintUserNFT(msg.sender);

        payable(treasury).transfer(msg.value);

        // Emit event
        emit NewSignUp(msg.sender, _userData);
    }

    //should be called by automation
    function revokeUser(
        address _member
    ) public /*onlyChainlink*/ deadlinePassed(_member) {
        // This function can only be called by the owner after the deadline has passed

        if (!isMember[_member]) {
            revert UnauthorizedMember(_member);
        }

        User memory user = users[_member];
        //isMember[_member] = false;
        if (block.timestamp > user.subDeadline) {
            user.subStatus = UserSubscriptionStatus.Expired;
            user.subDeadline = 0;
        }
        users[_member] = user;
        uint256 userIndex = _getUserIndex(_member);
        allUsers[userIndex] = user;
        uint256 userTokenId = userNFT.getTokenIdOfOwner(user.userAddress);

        userNFT.burn(user.userAddress, userTokenId);

        emit BurnUserNFT(user.userAddress, userTokenId);
        //nft will be used for access control with lighthouse
    }

    /// @notice Function used to apply to community
    function applyForNutritionistRole(
        string calldata dataURI
    ) external payable {
        // Check that sender isn't a nutritionist already
        if (isNutritionist[msg.sender]) {
            revert AlreadyANutrionist();
        }

        uint256 index = _applicantIndexCounter.current();
        NutritionistApplicationStatus applicationStatus = nutritionistApplicationStatus[
                msg.sender
            ];

        if (
            applicationStatus == NutritionistApplicationStatus.Pending ||
            applicationStatus == NutritionistApplicationStatus.Accepted
        ) {
            revert UnauthorizedApplication(
                "Community: already applied/pending"
            );
        }

        if (msg.value < nutritionistApplicationFee) {
            revert InsufficientPayment();
        }

        applicationStatus = NutritionistApplicationStatus.Pending;
        NutritionistApplication memory application = NutritionistApplication(
            dataURI,
            msg.sender,
            applicationStatus
        );
        applicantToIndex[msg.sender] = index;
        nutritionistApplicationStatus[msg.sender] = applicationStatus;
        nutritionistApplications[msg.sender] = application;
        allNutritionistsApplicants.push(msg.sender);
        allNutritionistsApplications.push(application);

        payable(treasury).transfer(msg.value);

        // Emit event
        emit NewApplication(msg.sender, dataURI);
    }

    function cancelNutritionistApplication()
        external
        onlyNutritionists
        applicantExists(msg.sender)
    {
        // Check that sender isn't a nutritionist already
        if (isNutritionist[msg.sender]) {
            revert AlreadyANutrionist();
        }

        NutritionistApplicationStatus applicationStatus = nutritionistApplicationStatus[
                msg.sender
            ];

        // if (applicationStatus != NutritionistApplicationStatus.Pending) {
        //     revert InvalidApplicant();
        // }

        uint256 applicantIndex = _getApplicantIndex(msg.sender);
        delete allNutritionistsApplicants[applicantIndex];
        delete nutritionistApplications[msg.sender];

        applicationStatus = NutritionistApplicationStatus.Canceled;
        nutritionistApplicationStatus[msg.sender] = applicationStatus;
    }

    /// @notice Function for community members to approve acceptance of new member to community
    function approveNutritionistRole(
        address applicant,
        string memory nutritionistNftUri
    ) external onlyOwner applicantExists(applicant) {
        // Check that sender isn't a nutritionist already
        if (isNutritionist[applicant]) {
            revert AlreadyANutrionist();
        }

        NutritionistApplicationStatus applicationStatus = nutritionistApplicationStatus[
                applicant
            ];

        // if (applicationStatus != NutritionistApplicationStatus.Pending) {
        //     revert InvalidApplicant();
        // }

        applicationStatus = NutritionistApplicationStatus.Accepted;
        nutritionistApplicationStatus[applicant] = applicationStatus;

        isNutritionist[applicant] = true;
        NutritionistApplication
            memory _nutritionistApplication = nutritionistApplications[
                applicant
            ];
        Nutritionist storage nutritionist = nutritionists[applicant];
        nutritionist.nutritionistAddress = _nutritionistApplication
            .nutritionistAddress;
        nutritionist.nutritionistPersonalData = _nutritionistApplication
            .dataURI;

        allNutritionists.push(nutritionist);
        allNutritionistsAddresses.push(applicant);

        nutritionistNFT.mint(msg.sender, nutritionistNftUri);

        emit MintNutritionistNFT(msg.sender);

        // Emit event
        emit ApplicationApproved(applicant);
    }

    function _getApplicantIndex(
        address _applicant
    ) internal view applicantExists(_applicant) returns (uint256 _index) {
        _index = applicantToIndex[_applicant];
    }

    function _getUserIndex(
        address _user
    ) internal view returns (uint256 _index) {
        if (!isMember[_user]) {
            revert UnauthorizedMember(_user);
        }
        _index = userToIndex[_user];
    }

    function rejectNutritionistRole(
        address applicant
    ) external onlyOwner applicantExists(applicant) {
        // Check that sender isn't a nutritionist already
        if (isNutritionist[applicant]) {
            revert AlreadyANutrionist();
        }

        NutritionistApplicationStatus applicationStatus = nutritionistApplicationStatus[
                applicant
            ];

        applicationStatus = NutritionistApplicationStatus.Rejected;
        nutritionistApplicationStatus[applicant] = applicationStatus;
    }

    function renewSubscription(
        string memory nftUri
    ) external onlyMembers deadlinePassed(msg.sender) {
        User memory user = users[msg.sender];
        if (user.subStatus != UserSubscriptionStatus.Expired) {
            revert InvalidSubStatus();
        }
        user.subStatus = UserSubscriptionStatus.Active;
        //isMember[msg.sender] = true;
        users[msg.sender] = user;

        userNFT.mint(msg.sender, nftUri);

        emit MintUserNFT(msg.sender);
    }

    function checkIsMember(address account) external view returns (bool) {
        return isMember[account];
    }

    function checkIsNutritionist(address account) external view returns (bool) {
        return isNutritionist[account];
    }

    function checkApplicationStatus(
        address account
    ) public view returns (NutritionistApplicationStatus) {
        return nutritionistApplicationStatus[account];
    }

    function getAllMembers() external view returns (User[] memory _users) {
        _users = allUsers;
    }

    function getAllNutritionists()
        external
        view
        returns (Nutritionist[] memory _nutritionists)
    {
        _nutritionists = allNutritionists;
    }

    //can be used to create meal plans that are pay-walled
    function createMealPlan(
        string memory _mealName,
        string memory mealPlanDesc
    ) external onlyNutritionists {
        Nutritionist storage _nutritionist = nutritionists[msg.sender];
        MealPlans memory mealPlan = MealPlans(
            _mealName,
            mealPlanDesc,
            msg.sender
        );
        _nutritionist.nutritionistMealplans.push(mealPlan);
    }

    function getAllMealPlans() public view returns (MealPlans[] memory) {
        return allMealPlans;
    }

    //can be used to create fitness plans that are pay-walled
    function createFitnessPlan(
        string memory _fitnessName,
        string memory fitnessDesc
    ) external onlyNutritionists {
        Nutritionist storage _nutritionist = nutritionists[msg.sender];
        FitnessPlans memory fitnessPlan = FitnessPlans(
            _fitnessName,
            fitnessDesc,
            msg.sender
        );
        _nutritionist.fitnessPlans.push(fitnessPlan);
    }

    function getAllFitnessPlans() public view returns (FitnessPlans[] memory) {
        return allFitnessPlans;
    }

    //review this, I don't know if this needs to live on the contracts
    function createConsultation(
        string memory _consultationDesc
    ) external onlyNutritionists {
        Nutritionist storage _nutritionist = nutritionists[msg.sender];
        ConsultationServices memory consultationService = ConsultationServices(
            msg.sender,
            _consultationDesc
        );
        _nutritionist.consultationServices = consultationService;
    }

    //can be used to publish articles that are pay-walled
    function publishArticle(
        string memory _title,
        string memory _authorName,
        string memory _content
    ) external onlyOwner onlyNutritionists {
        Nutritionist storage _nutritionist = nutritionists[msg.sender];
        Articles memory article = Articles(
            _title,
            msg.sender,
            _authorName,
            _content
        );
        _nutritionist.nutritionistArticles.push(article);
        allArticles.push(article);
    }

    //can be used to get all articles that are pay-walled
    function getAllArticles() public view returns (Articles[] memory) {
        return allArticles;
    }

    function createCommunity(
        string memory name,
        string memory communityDesc,
        address[] memory _members
    ) public {
        uint256 index = communityIdCounter.current();
        Community memory _community = Community(
            index,
            name,
            communityDesc,
            _members
        );
        idToCommunity[index] = _community;
        allCommunities.push(_community);
        for (uint16 i; i < _members.length; i++) {
            userToCommunity[_members[i]] = _community;
        }
        communityIdCounter.increment();
    }

    function joinCommunity(uint256 _communityId) public {
        Community memory _community = idToCommunity[_communityId];
        userToCommunity[msg.sender] = _community;
    }

    function getAllCommunties() public view returns (Community[] memory) {
        return allCommunities;
    }

    function registerAndPredictID(AutomationRegistrarInterface.RegistrationParams memory params) public {
        // LINK must be approved for transfer - this can be done every time or once
        // with an infinite approval
        i_link.approve(address(i_registrar), params.amount);
        uint256 upkeepID = i_registrar.registerUpkeep(params);
        if (upkeepID != 0) {
            // DEV - Use the upkeepID however you see fit
        } else {
            revert("auto-approve disabled");
        }
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    ) external view returns (bool upkeepNeeded, bytes memory performData) {
        //decode check data if you using it
        //if interval has passed then return true

        bool status;
        User[] memory newUserArr = new User[](allUsers.length);
        for (uint16 i = 0; i < allUsers.length; i++) {
            User memory user = allUsers[i];
            if (block.timestamp > user.subDeadline) {
                // user.subStatus = UserSubscriptionStatus.Expired;
                // user.subDeadline = 0;
                newUserArr[i] = user;
                status = true;
            }
        }
        //upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        upkeepNeeded = status;
        performData = abi.encode(newUserArr);
        //pass checkData through to performData
    }

    function performUpkeep(bytes calldata performData) external {
        //We highly recommend revalidating the upkeep in the performUpkeep function
        User[] memory usersArr = abi.decode(performData, (User[]));
        for (uint16 i = 0; i < usersArr.length; i++) {
            User memory user = usersArr[i];
            address userAddress = user.userAddress;
            if (block.timestamp > user.subDeadline) {
                revokeUser(userAddress);
            }
        }
    }
}
