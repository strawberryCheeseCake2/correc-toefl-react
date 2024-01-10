

const offTopicRubric = " Check if off-topic sentence exists"

const structureVarietyRubric = "check if the answer lacks variety of syntactic structures and appropriate word choice"

const elaborationRubric = "check if the  explanations, exemplifications, and/or details are relevant and  adequately elaborated"

const systemMessage = "if it is, You MUST INCLUDE the sentence of the answer"

const createQAPrompt = (question, answer, initialRubric = offTopicRubric) => {
  const prompt = `
    Here is a pair of TOEFL writing question and answer. ${initialRubric}:
    Question: ${question}
    Answer: ${answer}
  `
  
  return prompt
}

const FeedbackType = {
  OFF_TOPIC: "offTopic",
  STRUCTURE_VARIETY: "structureVariety",
  ELABORATION: "elaboration"
}

const createMessages = (question, answer, feebackType) => {

  let rubric = ""
  let systemMessagePayload = ""
  let sysMsg = ""

  switch (feebackType) {
    case FeedbackType.STRUCTURE_VARIETY:
      rubric = structureVarietyRubric
      // systemMessagePayload = "which lacks structure variety"
      sysMsg = "if it is, You MUST specify what sentences share same structure."
      break
    case FeedbackType.ELABORATION:
      rubric = elaborationRubric
      // systemMessagePayload = "which lacks elaboration"
      sysMsg = "if it is, You MUST INCLUDE the sentence of the answer"
      break
    default:
      rubric = offTopicRubric
      // systemMessagePayload = "which is off-topic"
      sysMsg = "if it is, You MUST INCLUDE the off-topic sentence of the answer"
      break
  }

  return [
    // {"role": "system", "content": `${systemMessage} ${systemMessagePayload}`},
    {"role": "system", "content": sysMsg},
    {"role": "user", "content": createQAPrompt(question, answer, rubric)},
    ]
}

export { createMessages, FeedbackType };