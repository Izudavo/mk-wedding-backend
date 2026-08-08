interface CheckInPageData {
  id: string;
  qr_token: string;
  full_name: string;
  phone_number: string;
  email: string | null;
  has_plus_one: boolean;
  plus_one_name: string | null;
  source: string;
  check_in_status: string;
  access_code: string | null;
}


export function renderCheckInPage(
  guest: CheckInPageData,
  nonce: string
) {
  const isCheckedIn =
    guest.check_in_status === "CHECKED_IN";


  const statusText = isCheckedIn
    ? "CHECKED IN"
    : "PENDING CHECK-IN";


  const statusClass = isCheckedIn
    ? "checked-in"
    : "pending";


  return `
<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>
    #AlleyesonMK | ${guest.full_name}
  </title>


  <style>

    * {
      box-sizing: border-box;
    }


    body {
      margin: 0;

      min-height: 100vh;

      display: flex;

      align-items: center;

      justify-content: center;

      padding: 24px 16px;

      background: #f4eee8;

      font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

      color: #3a2928;
    }


    .receipt {
      position: relative;

      width: 100%;

      max-width: 420px;

      padding: 34px 28px 46px;

      background: #fffdf9;

      border-top: 8px solid #722f37;

      box-shadow:
        0 12px 35px
        rgba(70, 35, 35, 0.15);

      overflow: hidden;
    }


    .header {
      text-align: center;
    }


    .brand {
      margin: 0;

      color: #722f37;

      font-size: 29px;

      font-weight: 800;

      letter-spacing: 0.5px;
    }


    .subtitle {
      margin-top: 7px;

      color: #7d9275;

      font-size: 12px;

      font-weight: 700;

      letter-spacing: 2px;

      text-transform: uppercase;
    }


    .divider {
      margin: 25px 0;

      border: 0;

      border-top:
        1px dashed #b9b0a8;
    }


    .guest-name {
      margin-bottom: 25px;

      color: #722f37;

      text-align: center;

      font-size: 26px;

      font-weight: 700;

      line-height: 1.25;
    }


    .row {
      display: flex;

      justify-content: space-between;

      align-items: flex-start;

      gap: 20px;

      padding: 13px 0;

      border-bottom:
        1px solid #eee6df;
    }


    .label {
      flex-shrink: 0;

      color: #8b817b;

      font-size: 10px;

      font-weight: 800;

      letter-spacing: 1px;

      text-transform: uppercase;
    }


    .value {
      max-width: 65%;

      color: #382928;

      font-size: 14px;

      font-weight: 600;

      text-align: right;

      word-break: break-word;
    }


    .status {
      margin-top: 24px;

      padding: 14px;

      border-radius: 8px;

      text-align: center;

      font-size: 12px;

      font-weight: 800;

      letter-spacing: 1px;
    }


    .pending {
      background: #f3ede3;

      color: #722f37;
    }


    .checked-in {
      background: #e4eee1;

      color: #4e6849;
    }


    .check-in-button {
      display: block;

      width: 100%;

      margin-top: 24px;

      padding: 15px 18px;

      border: 0;

      border-radius: 8px;

      background: #722f37;

      color: #ffffff;

      font-size: 13px;

      font-weight: 800;

      letter-spacing: 0.8px;

      cursor: pointer;

      transition:
        opacity 0.2s ease,
        transform 0.1s ease;
    }


    .check-in-button:hover {
      opacity: 0.92;
    }


    .check-in-button:active {
      transform: scale(0.99);
    }


    .check-in-button:disabled {
      opacity: 0.6;

      cursor: not-allowed;
    }


    .footer {
      margin-top: 28px;

      color: #7d9275;

      text-align: center;

      font-size: 12px;

      line-height: 1.6;
    }


    .tear {
      position: absolute;

      bottom: -1px;

      left: 0;

      width: 100%;

      height: 13px;

      background:
        radial-gradient(
          circle at 6px -1px,
          transparent 7px,
          #f4eee8 7px
        )
        0 0 / 12px 12px repeat-x;
    }

  </style>

</head>


<body>


  <main class="receipt">


    <section class="header">

      <h1 class="brand">
        #AlleyesonMK
      </h1>

      <div class="subtitle">
        Wedding RSVP
      </div>

    </section>


    <hr class="divider" />


    <div class="guest-name">
      ${guest.full_name}
    </div>


    <div class="row">

      <span class="label">
        Phone
      </span>

      <span class="value">
        ${guest.phone_number}
      </span>

    </div>


    ${
      guest.email
        ? `
          <div class="row">

            <span class="label">
              Email
            </span>

            <span class="value">
              ${guest.email}
            </span>

          </div>
        `
        : ""
    }


    <div class="row">

      <span class="label">
        Plus One
      </span>

      <span class="value">

        ${
          guest.has_plus_one
            ? guest.plus_one_name ?? "Yes"
            : "None"
        }

      </span>

    </div>


    ${
      guest.access_code
        ? `
          <div class="row">

            <span class="label">
              Access Code
            </span>

            <span class="value">
              ${guest.access_code}
            </span>

          </div>
        `
        : ""
    }


    <div class="status ${statusClass}">
      ${statusText}
    </div>


    ${
      !isCheckedIn
        ? `
          <button
            type="button"
            class="check-in-button"
            id="check-in-button"
          >
            CHECK IN GUEST
          </button>
        `
        : ""
    }


    <div class="footer">

      Thank you for celebrating<br />

      with us.

    </div>


    <div class="tear"></div>


  </main>


  <script nonce="${nonce}">

    const checkInButton =
      document.getElementById(
        "check-in-button"
      );


    async function checkInGuest() {

      if (!checkInButton) {
        return;
      }


      checkInButton.disabled = true;

      checkInButton.textContent =
        "CHECKING IN...";


      try {

        console.log(
          "Check-in button clicked."
        );


        console.log(
          "QR token:",
          "${guest.qr_token}"
        );


        const response =
          await fetch(
            "/check-in/${guest.qr_token}",
            {
              method: "PATCH"
            }
          );


        console.log(
          "PATCH status:",
          response.status
        );


        const result =
          await response.json();


        console.log(
          "PATCH response:",
          result
        );


        if (
          !response.ok ||
          !result.success
        ) {

          throw new Error(
            result.message ||
            "Unable to check in guest."
          );

        }


        window.location.reload();

      } catch (error) {

        console.error(
          "Check-in error:",
          error
        );


        alert(
          error instanceof Error
            ? error.message
            : "Unable to check in guest."
        );


        checkInButton.disabled = false;

        checkInButton.textContent =
          "CHECK IN GUEST";
      }

    }


    if (checkInButton) {

      checkInButton.addEventListener(
        "click",
        checkInGuest
      );

    }

  </script>


</body>

</html>
  `;
}

