declare global {
  /**
   * The method to call
   */
  const method: string;
  /**
   * The data to sign
   */
  const toSign: Uint8Array;
  /**
   * The name of the signature
   */
  const sigName: string;
  /**
   * The bot token passed in JSParams
   */
  const botToken: string;
  /**
   * The public key passed of the PKP
   */
  const publicKey: string;
  /**
   * The Twitter API Object
   */
}
/**
 * The return type of the Twitter API
 */
interface TwitterAPIResponse {
  data: {
    id: string;
    name: string;
    username: string;
  };
}

async function authenticate(_botToken: string): Promise<undefined> {
  try {
    const response = await fetch(`https://api.x.com/2/users/me`, {
      headers: {
        Authorization: `Bearer ${_botToken}`,
      },
    });
    const responseJson = await response.json();
    if (responseJson.data.id) {
      const res = await response.json();
      console.log("Response from Twitter API:", res);
      return res;
    }
    return undefined;
  } catch (error) {
    console.error("Error authenticating bot", error);
    return undefined;
  }
}

async function authorize(
  _publicKey: string,
  _botInfo: TwitterAPIResponse,
  _ipfsActionId: string
): Promise<boolean> {
  try {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const _tokenId = await Lit.Actions.pubkeyToTokenId({
      publicKey: _publicKey,
    });
    console.log("tokenId", _tokenId);
    const _userId = await getUserIdFromBotIdAndActionId(
      _ipfsActionId,
      _botInfo.data.id
    );
    console.log("userId", _userId);
    const permittedAuthMethods = await Lit.Actions.getPermittedAuthMethods({
      tokenId: _tokenId,
    });
    console.log("permittedAuthMethods", permittedAuthMethods);
    const isActionPermitted = await Lit.Actions.isPermittedAction({
      tokenId: _tokenId,
      ipfsId: _ipfsActionId,
    });
    console.log("isActionPermitted:", isActionPermitted);
    console.log("COLLABLAND_BOT_CUSTOM_AUTH_ID", COLLABLAND_BOT_CUSTOM_AUTH_ID);
    const authMethodType = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(COLLABLAND_BOT_CUSTOM_AUTH_ID)
    );
    console.log("authMethodType", authMethodType);
    const isBotTokenPermitted = await Lit.Actions.isPermittedAuthMethod({
      tokenId: _tokenId,
      //@ts-expect-error although expects a number, but we can pass a hex string
      authMethodType,
      userId: ethers.utils.arrayify(_userId),
    });
    console.log("isBotTokenPermitted", isBotTokenPermitted);
    return isActionPermitted && isBotTokenPermitted;
  } catch (error) {
    console.error("Error authorizing bot", error);
    return false;
  }
}

async function getUserIdFromBotIdAndActionId(
  _ipfsActionId: string,
  _botId: string
): Promise<string> {
  const keyId = await ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(`${_ipfsActionId}_${_botId}`)
  );
  return keyId;
}

async function main() {
  console.log("Lit.Auth", Lit.Auth);
  const botInfo = await authenticate(botToken);
  console.log("botInfo from Telegram API:", botInfo);
  if (!botInfo) {
    Lit.Actions.setResponse({ response: "false" });
    return;
  }
  const ipfsActionId = Lit.Auth.actionIpfsIds[0];
  // can't authorize if we're claiming a key, just authenticate
  if (method === "claimKey") {
    const userId = botInfo.result.id.toString();
    console.log("Claiming key for user %s", userId);
    await Lit.Actions.claimKey({
      keyId: userId,
    });
    Lit.Actions.setResponse({ response: "true" });
    return;
  }

  const isAuthorized = await authorize(publicKey, botInfo, ipfsActionId);
  if (!isAuthorized) {
    Lit.Actions.setResponse({ response: "false" });
    return;
  }
  switch (method) {
    case "signEcdsa": {
      console.log(
        "Signing %s for (publicKey=%s) (sigName=%s)",
        toSign,
        publicKey,
        sigName
      );
      const signature = await Lit.Actions.signEcdsa({
        toSign,
        sigName,
        publicKey,
      });
      Lit.Actions.setResponse({ response: "true" });
      return signature;
    }
    default: {
      // relevant for signing session sigs
      console.error("Invalid method, defaulting to true", method);
      Lit.Actions.setResponse({ response: "true" });
      break;
    }
  }
}

main();
