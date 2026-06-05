import { defaultConfig; type Config } "mo:openai-client/Config";
import ChatApi "mo:openai-client/Apis/ChatApi";
import CreateChatCompletionRequest "mo:openai-client/Models/CreateChatCompletionRequest";
import ChatCompletionRequestMessage "mo:openai-client/Models/ChatCompletionRequestMessage";
import ChatCompletionRequestUserMessage "mo:openai-client/Models/ChatCompletionRequestUserMessage";
import ChatCompletionRequestAssistantMessage "mo:openai-client/Models/ChatCompletionRequestAssistantMessage";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import AIChatTypes "../types/aichat";

module {
  public func configForKey(key : Text) : Config {
    { defaultConfig with auth = ?#bearer key; is_replicated = ?false };
  };

  func systemPrompt() : Text {
    "You are an AI startup cofounder for Foundrly AI, a platform where teenagers build startups. " #
    "Help users with startup ideas, business models, pitch decks, market sizing, competitor analysis, " #
    "MVP planning, monetization strategies, team building, and execution roadmaps. " #
    "Be concise, practical, and encouraging. Use bullet points and structured responses where helpful.";
  };

  public func runChatWithHistory(
    config : Config,
    history : [AIChatTypes.AIChatMessage],
    userPrompt : Text,
  ) : async* Text {
    let sysMsg = ChatCompletionRequestUserMessage.JSON.init({
      content = #string(systemPrompt());
      role = #user;
    });
    var apiMessages : [ChatCompletionRequestMessage.ChatCompletionRequestMessage] = [#user(sysMsg)];

    for (msg in history.vals()) {
      switch (msg.role) {
        case (#user) {
          let m = ChatCompletionRequestUserMessage.JSON.init({
            content = #string(msg.content);
            role = #user;
          });
          apiMessages := apiMessages.concat([#user(m)]);
        };
        case (#assistant) {
          let m = ChatCompletionRequestAssistantMessage.JSON.init({ role = #assistant });
          let mWithContent = { m with content = ?#string(msg.content) };
          apiMessages := apiMessages.concat([#assistant(mWithContent)]);
        };
      };
    };

    let newUserMsg = ChatCompletionRequestUserMessage.JSON.init({
      content = #string(userPrompt);
      role = #user;
    });
    apiMessages := apiMessages.concat([#user(newUserMsg)]);

    let req = CreateChatCompletionRequest.JSON.init({
      messages = apiMessages;
      model = "gpt-4o-mini";
    });

    let resp = await* ChatApi.createChatCompletion(config, req);

    if (resp.choices.size() == 0) Runtime.trap("OpenAI returned no choices");
    switch (resp.choices[0].message.content) {
      case (?text) text;
      case null Runtime.trap("OpenAI returned no text content");
    };
  };
};
