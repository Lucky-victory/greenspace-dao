const data = {
  "What's your date of birth": [],
  "What's your biological sex": ["Male", "Female"],
  "What's your weight?": [],
  "What's your height in inches?": [],
  "Tell us about your diet?": [
    "I eat 5 or more servings of vegetables per day",
    "I eat two or more servings of fruit per day",
    "I have two or more servings of dairy (or equivalent) per day",
    "My cereals are mostly whole grains",
    "I eat fast lean protein every day",
    "I eat fast food once per week or less",
    "I eat pastries or cakes once a week or less",
    "I have less than 1 teaspoon of salt per day",
    "I have 2 or less alcholic drinks on any day",
    "I drink at least 2 litres of water per day",
  ],
  "How active are you on an average week?": [
    "Inactive",
    "active",
    "very active",
  ],
  "How many hours a day are you sitting": [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24,
  ],
  "How much alchohol do you drink": [
    "0 - 10 drinks a week",
    "10 - 20 drinks a week",
    "greater than 20 drinks a week",
  ],
  "Do you smoke?": ["Never smoked", "Ex smoker", "Current smoker"],
  "If you are an ex-smoker, how many months ago did you stop?": [
    "less than 6 months ago",
    "six to twelve months ago",
    "more than twelve months ago",
  ],
  "If you are a current smoker, how many cigarettes do you smoke per day?": [
    "less than 5 cigarettes",
    "5 to 10 cigarettes",
    "11 to 20 cigarettes",
    "above 20 cigarettes",
  ],
  "How many hours of sleep do you get per day?": [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  ],
  "Rate your overall Health": [
    "Excellent",
    "Very good",
    "Good",
    "Fair",
    "Poor",
  ],
};

export const initial_condition = `
    You are a robot built by RevitalizeAI. Your goal is to predict the rate of aging of users.
    You must respond with the following json output and nothing else. (Reverse, Fast, Moderate, Slow)
    example: {"aging": "Fast"}

    These outputs depend on the input data provided.
    An input data is a json object, with questions as keys and the possible answers as values.
    Note the values are a list of strings.

    example ${data}
`;

export const prompt1 = `
    Given the following:

    Date of Birth: 10 August 1990
    Sex: Female
    Weight: 80kg
    Height: 5ft 5
    Diet: "I eat fast food once per week or less" and "I have less than 1 teaspoon of salt per day"
    Physical Activity: Inactive
    Hours Sitting Per Day: 10 hours
    Alcohol Rate: Greater than 20 drinks a week
    Smoking: Current smoker (11 to 20 cigarettes per day)
    Sleep Per Day: 4 hours
    Overall Health Rating: Poor

    Calculate my rate of aging?
    Ensure to respond with the output option on the initial condition.
    I know you don't have enough data but use your best understanding.
    Respond with either Reverse, Fast, Moderate, or Slow. Remember as a json object.
`;
