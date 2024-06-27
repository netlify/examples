async function waitForClerk() {
  if (typeof Clerk === "undefined") {
    return setTimeout(waitForClerk, 50);
  }
  initClerk();
}

async function initClerk() {
  await Clerk.load();
  Clerk.addListener(() => toggleUI());
}

async function toggleUI() {
  const currentUser = await Clerk.user;
  console.log({ currentUser });
  const userInfo = document.getElementById("user-info");
  const authTrigger = document.getElementById("auth-trigger");

  if (currentUser) {
    userInfo.innerText = currentUser.emailAddresses[0].emailAddress;
    authTrigger.innerText = "Sign out";
    authTrigger.onclick = () => Clerk.signOut();
  } else {
    userInfo.innerText = "";
    authTrigger.innerText = "Sign in";
    authTrigger.onclick = () => Clerk.openSignIn();
  }
}

waitForClerk();
