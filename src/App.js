import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Card from "@mui/material/Card";
import SignatureCanvas from "react-signature-canvas";
import { useFormik } from "formik";
import * as yup from "yup";
import { useRef, useState } from "react";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";
import FormHelperText from "@mui/material/FormHelperText";

const theme = createTheme();

export default function Home() {
  let sigCanvas = useRef(null);
  const [result, setresult] = useState("");

  const [imageURL, setImageURL] = useState(undefined);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
    formik.setTouched({ ...formik.touched, ["signature"]: true });
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [openSubmit, setOpenSubmit] = React.useState(false);
  const handleOpenSubmit = () => setOpenSubmit(true);
  const handleCloseSubmit = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpenSubmit(false);
    }
  };

  const [openRes, setOpenRes] = React.useState(false);
  const handleOpenRes = () => setOpenRes(true);
  const handleCloseRes = () => {
    setOpenRes(false);
  };

  const create = () => {
    if (!sigCanvas.isEmpty()) {
      const URL = sigCanvas.getTrimmedCanvas().toDataURL("image/png");
      setImageURL(URL);
      formik.setFieldValue("signature", URL);
      handleClose();
    }
  };

  const clear = () => {
    // @ts-ignore: not exist on type 'MutableRefObject<any>'
    sigCanvas.clear();
    setImageURL(undefined);
    formik.setFieldValue("signature", null);
  };

  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let fullDate = `${getMonth(month)} ${day}, ${year}`;

  function getMonth(month) {
    let monthFull = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthFull[month - 1];
  }

  const validationSchema = yup.object({
    firstName: yup.string().required("Your first name is required"),
    middleName: yup.string().required("Your middle name is required"),
    lastName: yup.string().required("Your last name is required"),
    franchise: yup.string().required("Franchise name is required"),
    amount: yup.number().required("Amount Payment is required"),
    authFirstName: yup.string().required("Sponsor's first name is required"),
    authMiddleName: yup.string().required("Sponsor's middle name is required"),
    authLastName: yup.string().required("Sponsor's last name is required"),
    signature: yup.string().required("Signature is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      franchise: "",
      amount: undefined,
      authFirstName: "",
      authMiddleName: "",
      authLastName: "",
      signature: undefined,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // console.log(JSON.stringify(values, null, 2));
      handleOpenSubmit();
      // 127.0.0.1
      axios
        .post("/", values)
        .then((res) => {
          console.log("res", res);

          if (res.statusText === "OK") {
            setOpenSubmit(false);
            setresult("Submitted successfully.");
            handleOpenRes();
            window.location.reload();
          }

          if (res.data.message === "err") {
            setOpenSubmit(false);
            setresult("Something went wrong, Please try again sdsd");
            handleOpenRes();
          }
        })
        .catch((err) => {
          setOpenSubmit(false);
          setresult("Something went wrong, Please try again");
          console.log(err);
          handleOpenRes();
        });
    },
  });

  const handleBackdropClick = (event) => {
    //these fail to keep the modal open
    event.stopPropagation();
    return false;
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "5px",
    boxShadow: 50,
    p: 4,
  };

  return (
    <>
      <Modal
        open={openRes}
        onClose={handleCloseRes}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6">
            {result}
          </Typography>
          <br></br>
        </Box>
      </Modal>

      <Modal
        open={openSubmit}
        onClose={handleCloseSubmit}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onBackdropClick={handleBackdropClick}
        disableEscapeKeyDown
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6">
            Please wait while we generate the contract for you.
          </Typography>
          <br></br>

          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        </Box>
      </Modal>

      <div className="lg:grid lg:grid-cols-5 ">
        <div className=" col-span-2 px-10 lg:max-h-screen overflow-y-auto">
          <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="sm">
              <CssBaseline />
              <Box
                sx={{
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography component="h3" variant="h6">
                  Fill up the following information to complete the contract
                </Typography>
                <Box
                  component="form"
                  noValidate
                  onSubmit={formik.handleSubmit}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={2}>
                    <Grid item sm={12}>
                      <Typography variant="body1">1. Client's Name</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        autoComplete="given-name"
                        name="firstName"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        autoFocus
                        error={
                          formik.touched.firstName &&
                          Boolean(formik.errors.firstName)
                        }
                        helperText={
                          formik.touched.firstName && formik.errors.firstName
                        }
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        required
                        fullWidth
                        id="middleName"
                        label="Middle Name"
                        name="middleName"
                        autoComplete="family-name"
                        value={formik.values.middleName}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.middleName &&
                          Boolean(formik.errors.middleName)
                        }
                        helperText={
                          formik.touched.middleName && formik.errors.middleName
                        }
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.lastName &&
                          Boolean(formik.errors.lastName)
                        }
                        helperText={
                          formik.touched.lastName && formik.errors.lastName
                        }
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                    <div className="pb-5">
                      <span className="text-white">.</span>
                    </div>

                    <Grid item sm={12}>
                      <Typography variant="body1">
                        2. Franchise Package
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl
                        fullWidth
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.franchise &&
                          Boolean(formik.errors.franchise)
                        }
                      >
                        <InputLabel id="demo-simple-select-label">
                          Franchise
                        </InputLabel>
                        <Select
                          labelId="franchise"
                          id="franchise"
                          label="Franchise"
                          value={formik.values.franchise}
                          onChange={(e) =>
                            formik.setFieldValue("franchise", e.target.value)
                          }
                        >
                          <MenuItem value={"All In One"}>All In One</MenuItem>
                          <MenuItem value={"Food"}>Food</MenuItem>
                          <MenuItem value={"Health Essentials"}>
                            Health Essentials
                          </MenuItem>
                          <MenuItem value={"2in1 (Toktok / Health Essentials)"}>
                            2in1 (Toktok / Health Essentials)
                          </MenuItem>
                          <MenuItem value={"2in1 (Food / Health Essentials)"}>
                            2in1 (Food / Health Essentials)
                          </MenuItem>
                          <MenuItem value={"Foodcart"}>Foodcart</MenuItem>
                        </Select>

                        <FormHelperText>
                          {formik.touched.franchise && formik.errors.franchise}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <div className="pb-5">
                      <span className="text-white">.</span>
                    </div>

                    <Grid item sm={12}>
                      <Typography variant="body1">3. Payment Amount</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="amount"
                        label="Payment Amount"
                        name="amount"
                        type="number"
                        value={formik.values.amount}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.amount && Boolean(formik.errors.amount)
                        }
                        helperText={
                          formik.touched.amount && formik.errors.amount
                        }
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                    <div className="pb-5">
                      <span className="text-white">.</span>
                    </div>

                    <Grid item sm={12}>
                      <Typography variant="body1">
                        4. Authorized Person to handle payment
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="authFirstName"
                        required
                        fullWidth
                        id="authFirstName"
                        label="First Name"
                        value={formik.values.authFirstName}
                        onChange={formik.handleChange}
                        autoFocus
                        error={
                          formik.touched.authFirstName &&
                          Boolean(formik.errors.authFirstName)
                        }
                        helperText={
                          formik.touched.authFirstName &&
                          formik.errors.authFirstName
                        }
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        required
                        fullWidth
                        id="authMiddleName"
                        label="Middle Name"
                        name="authMiddleName"
                        value={formik.values.authMiddleName}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.authMiddleName &&
                          Boolean(formik.errors.authMiddleName)
                        }
                        helperText={
                          formik.touched.authMiddleName &&
                          formik.errors.authMiddleName
                        }
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        required
                        fullWidth
                        id="authLastName"
                        label="Last Name"
                        name="authLastName"
                        value={formik.values.authLastName}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.authLastName &&
                          Boolean(formik.errors.authLastName)
                        }
                        helperText={
                          formik.touched.authLastName &&
                          formik.errors.authLastName
                        }
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                    <div className="pb-5">
                      <span className="text-white">.</span>
                    </div>
                    <Grid item xs={12}>
                      <div className="block pb-10">
                        <Typography variant="body1">
                          5. Create your Digital Signature
                        </Typography>
                        <p className="py-5">
                          <a
                            className="px-4 py-3 text-white bg-black text-sm rounded-md cursor-pointer"
                            onClick={handleOpen}
                          >
                            Open Signature Pad
                          </a>
                        </p>
                        {imageURL && (
                          <img
                            src={imageURL}
                            alt="signature"
                            className="signature"
                          />
                        )}
                        <div className="!text-red-500 pl-4">
                          <FormHelperText error={true}>
                            {formik.touched.signature &&
                              formik.errors.signature}
                          </FormHelperText>
                        </div>
                      </div>

                      <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <Box sx={style}>
                          <Typography id="modal-modal-title" variant="h6">
                            Sign your digital signature here
                          </Typography>
                          <br></br>

                          <Card variant="outlined">
                            <SignatureCanvas
                              penColor="black"
                              canvasProps={{
                                height: 300,
                                className: "sigCanvas",
                              }}
                              // @ts-ignore: not exist on type 'MutableRefObject<any>'
                              ref={(ref) => {
                                sigCanvas = ref;
                              }}
                            />
                          </Card>
                          <div className="flex justify-evenly pt-5">
                            <a
                              className="px-4 py-2 text-sm text-white bg-red-600 rounded-md cursor-pointer"
                              onClick={() => clear()}
                            >
                              Clear
                            </a>
                            <a
                              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md cursor-pointer"
                              onClick={() => create()}
                            >
                              Create
                            </a>
                          </div>
                        </Box>
                      </Modal>
                    </Grid>

                    {/* <Grid item xs={12}>
                      <FormControlLabel
                        control={<Checkbox value="allowExtraEmails" color="primary" />}
                        label="I want to receive inspiration, marketing promotions and updates via email."
                      />
                    </Grid> */}
                  </Grid>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="w-full bg-green-700 text-white py-2 rounded-md"
                    >
                      {" "}
                      Submit Contract
                    </button>
                  </div>
                  {/* <Grid container justifyContent="flex-end">
                    <Grid item>
                      <Link href="#" variant="body2">
                        Already have an account? Sign in
                      </Link>
                    </Grid>
                  </Grid> */}
                  <div className="pb-10"></div>
                </Box>
              </Box>
            </Container>
          </ThemeProvider>
        </div>
        <div className=" col-span-3 px-10 py-16 bg-grid lg:max-h-screen overflow-y-auto">
          <div className="pb-5">
            For demo purposes: After submitting Contract:
            <br />
            <a href="https://drive.google.com/drive/u/2/folders/1x5GEPqekfGwdbHd949T8kyF3k2XNdggX">
              Your generated contract will be saved here{" "}
              <span class="text-blue-500 underline">Google Drive</span>
            </a>
            <br />
            <a href="https://docs.google.com/spreadsheets/d/1r7uIJ8HZUpveoBuaoeDuxiIJ_q6TivnbzMVXbaT7ApE">
              Your details will be appended here{" "}
              <span class="text-blue-500 underline">Google Sheet</span>
            </a>
          </div>
          <div className="bg-white px-16 py-16 max-w-3xl m-auto">
            <div className="flex justify-center pb-10">
              {/* <img src="/eralista.png" alt="" className=" w-60" /> */}
              <div className="text-center">
                <h1 className=" font-bold text-2xl">Company ABC</h1>
                <p className=" italic">
                  Sample Contract Content for Demo Purpose
                </p>
                <p className=" italic">
                  Do not put your identifiable information
                </p>
              </div>
            </div>
            <p>
              This is to confirm that{" "}
              <b>
                <u>
                  {formik.values.firstName
                    ? formik.values.firstName
                    : "First name,"}
                  &nbsp;
                  {formik.values.middleName
                    ? formik.values.middleName
                    : "Middle name, "}
                  &nbsp;
                  {formik.values.lastName
                    ? formik.values.lastName
                    : "Last name "}
                </u>
              </b>{" "}
              will avail of the{" "}
              <b>
                <u>
                  {formik.values.franchise
                    ? formik.values.franchise
                    : "Franchise Type"}
                </u>
              </b>{" "}
              Franchise Package amounting to{" "}
              <b>
                <u>
                  {formik.values.amount
                    ? formik.values.amount
                    : "Amount in PHP"}
                </u>
              </b>{" "}
              pesos only.
            </p>
            <br></br>
            <p>The Franchise is lifetime and has no expiration.</p>
            <br></br>
            <p>
              It includes referral commissions from the line of business/es that
              I will avail.
            </p>
            <br></br>
            {/* <p>It also includes Other Ways to Earn from JC.</p> */}
            <br></br>
            <br></br>
            <br></br>
            <p>
              <b>SUPPORT SYSTEM</b>
            </p>
            <br></br>
            <p>
              The Franchise of{" "}
              <b>
                <u>
                  {formik.values.franchise
                    ? formik.values.franchise
                    : "Franchise Type"}
                </u>
              </b>{" "}
              will be handled by Company ABC.
            </p>
            <br></br>
            <br></br>
            <br></br>
            <p>
              <b>Company ABC will provide the following steps:</b>
            </p>
            <br></br>
            <p className="pb-2">STEP 1: APPLICATION/REQUIREMENTS</p>
            <div className="pl-6">
              <p>
                ✔ Basic Information: Complete Name, Address, Contact Number, and
                Email Address
              </p>
              <p>✔ Valid ID</p>
              <p>✔ Signed Agreement Form</p>
            </div>
            <br></br>

            <p className="pb-2">STEP 2: SYSTEM TRAINING</p>
            <div className="pl-6">
              <p>✔ How to navigate your APP? </p>
              <p>✔ How to be an operator? How to hire riders?</p>
              <p>✔ How to share your referral code?</p>
              <p>✔ How to encash your commission?</p>
            </div>

            <br></br>
            <br></br>
            <br></br>
            <p>
              <b>
                <u>
                  {formik.values.firstName
                    ? formik.values.firstName
                    : "First name,"}
                  &nbsp;
                  {formik.values.middleName
                    ? formik.values.middleName
                    : "Middle name, "}
                  &nbsp;
                  {formik.values.lastName
                    ? formik.values.lastName
                    : "Last name "}
                </u>
              </b>{" "}
              has the option to provide a trusted person to handle the
              management of his Franchise and we will give the COMPLETE TRAINING
              and SUPPORT to the said person/s.
            </p>
            <br></br>
            <p>
              I am now authorizing{" "}
              <b>
                <u>
                  {formik.values.authFirstName
                    ? formik.values.authFirstName
                    : "First name, "}
                  &nbsp;
                  {formik.values.authMiddleName
                    ? formik.values.authMiddleName
                    : "Middle name, "}
                  &nbsp;
                  {formik.values.authLastName
                    ? formik.values.authLastName
                    : "Last name"}
                </u>
              </b>{" "}
              to transact the amount of{" "}
              <b>
                <u>
                  {formik.values.amount
                    ? formik.values.amount
                    : "Amount in PHP"}
                </u>
              </b>{" "}
              pesos on my behalf.
            </p>
            <br></br>
            <p className="text-center text-sm">
              <i>
                (Once activated, your payment for your Online Franchise Account
                is NON-REFUNDABLE.)
              </i>
            </p>
            <br></br>
            <br></br>
            <br></br>
            <p>
              <b>DISCLAIMER</b>
            </p>
            <p>
              By signing this agreement, I hereby acknowledge and agree that the
              process of availing the Online Franchise was clearly explained to
              me by my Sponsor/Franchise Consultant.
            </p>
            <br></br>
            <p>
              I authorize Company ABC to collect and process the data indicated
              herein for the purpose of availing the franchise package. I
              understand that my personal information is protected by RA 10173
              (Data Privacy Act of 2012).
            </p>

            <br></br>
            <br></br>
            <p>
              {imageURL && (
                <img
                  src={imageURL}
                  alt="signature"
                  className="signature w-28"
                />
              )}
            </p>
            <div className="flex gap-10 content-end">
              <div>
                <p className="uppercase">
                  <b>
                    <u>
                      {formik.values.firstName
                        ? formik.values.firstName
                        : "First name,"}
                      &nbsp;
                      {formik.values.middleName
                        ? formik.values.middleName
                        : "Middle name, "}
                      &nbsp;
                      {formik.values.lastName
                        ? formik.values.lastName
                        : "Last name "}
                    </u>
                  </b>
                </p>
                <p>Signature above printed name</p>
              </div>

              <div>
                <p className="">
                  <b>
                    <u>{fullDate}</u>
                  </b>
                </p>
                <p>Date</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
