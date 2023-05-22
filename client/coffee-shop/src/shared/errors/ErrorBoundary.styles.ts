import { createStyles } from "@material-ui/core";

const styles = createStyles({
  root: {
    display: "flex",
    flex: "1 1 auto",
    padding: 24,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: "1 1 auto",
    backgroundColor: "white",
  },
  backgroundImage: {},
  message: {
    fontSize: 28,
    fontWeight: 500,
    lineHeight: "36px",
  },
});

export default styles;
