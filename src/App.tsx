import React, { useState, useRef, useCallback, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import Grid from "@mui/material/Unstable_Grid2";
import styled from "styled-components";

import {
  Typography,
  FormControl,
  FormControlLabel,
  Alert,
  AlertTitle,
  RadioGroup,
  Radio,
  Button,
  Stack,
} from "@mui/material";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import ListAltIcon from "@mui/icons-material/ListAlt";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import type { RootState, AppDispatch } from "./redux/store";
import { useSelector, useDispatch } from "react-redux";
import { fetchElements } from "./redux/dataSlice";

const Item = styled.div`
  padding: 1rem;
`;

const StyledSearchIcon = styled(SearchIcon)``;
const StyledListAltIcon = styled(ListAltIcon)``;

const Title = styled.div`
  font-size: 1.5rem;
  display: flex;
  align-items: center;

  ${StyledSearchIcon}, ${StyledListAltIcon} {
    margin-left: 10px;
  }
`;

function App() {
  const [radio, setRadio] = useState("artists");
  const [title, setTitle] = useState("");
  const [fetching, setFetching] = useState(false);
  // const [results, setResults] = useState<any[]>([]);
  const [resultsVisible, setResultsVisible] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const loader = useRef(null);

  let { results }: any = useSelector((state: RootState) => state.results);
  const dispatch = useDispatch<AppDispatch>();

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadio((event.target as HTMLInputElement).value);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle((event.target as HTMLInputElement).value);
  };

  const handleObserver = useCallback((entries: any) => {
    const target = entries[0];

    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver]);

  const getFilteredData = async () => {
    resetValues();
    setFetching(true);
    try {
      // const response = await fetch("/" + radio + "/" + title);
      await dispatch(fetchElements({ url: "/" + radio + "/" + title }));
      setFetching(false);
    } catch (error: any) {
      results = [];
      if (error.message.includes("Unexpected end of JSON input")) {
        console.error("No results - can be a rate limit.");
      }
      setFetching(false);
    }
  };

  useEffect(() => {
    getPage(page);
  }, [results]);

  const getPage = async (page: number, amount: number = 10) => {
    const paginatedItems = results.slice((page - 1) * amount, page * amount);
    await setResultsVisible([...resultsVisible, ...paginatedItems]);
  };

  const resetValues = () => {
    results = [];
    setResultsVisible([]);
    setPage(1);
  };

  useEffect(() => {
    if (page > 1 && page <= 20) {
      getPage(page);
    }
  }, [page]);

  const SearchItem = ({
    image,
    artistName,
    trackName,
  }: {
    image: string;
    artistName: string;
    trackName: string;
  }) => {
    return (
      <Box
        sx={{
          // width: 1000,
          height: 100,
          backgroundColor: "primary.dark",
          "&:hover": {
            backgroundColor: "primary.main",
            opacity: [0.9, 0.8, 0.7],
          },
          marginTop: 3,
        }}
      >
        <Grid
          display="flex"
          container
          spacing={0}
          paddingTop={0}
          alignItems="center"
          height="100%"
        >
          <Grid display="flex" xs={1} alignItems="center">
            <img src={image} alt={trackName} />
          </Grid>
          <Grid display="flex" xs={3} alignItems="center">
            {artistName}
          </Grid>
          <Grid display="flex" xs={8} alignItems="center">
            {trackName}
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <div className="App">
      <HelmetProvider>
        <meta charSet="utf-8" />
        <title>Next Front-End Technical Test</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </HelmetProvider>
      <Backdrop sx={{ color: "#fff", zIndex: 2 }} open={fetching}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container spacing={2}>
        <Grid xs={12} md={12}>
          <Item>
            <Typography variant="h3" component="h1">
              iTunes Search API
            </Typography>
          </Item>
        </Grid>
        <Grid xs={12} md={3}>
          <Item>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
              onSubmit={(event: any) => {
                event.preventDefault();
                getFilteredData();
              }}
            >
              <Title>
                Criterias <StyledSearchIcon />
              </Title>

              <FormControl>
                <TextField
                  id="outlined-basic"
                  label={
                    radio === "artists"
                      ? "Artist name"
                      : radio === "albums"
                      ? "Title of album"
                      : radio === "songs"
                      ? "Title of song"
                      : null
                  }
                  variant="outlined"
                  value={title}
                  onChange={handleTitleChange}
                />
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={radio}
                  onChange={handleRadioChange}
                >
                  <FormControlLabel
                    value="artists"
                    control={<Radio />}
                    label="Artists"
                  />
                  <FormControlLabel
                    value="albums"
                    control={<Radio />}
                    label="Albums"
                  />
                  <FormControlLabel
                    value="songs"
                    control={<Radio />}
                    label="Songs"
                  />
                </RadioGroup>
                <Stack spacing={2} direction="row">
                  <Button variant="contained" type="submit">
                    Search
                  </Button>
                  <Button
                    variant="outlined"
                    type="reset"
                    onClick={() => {
                      resetValues();
                    }}
                  >
                    Reset
                  </Button>
                </Stack>
              </FormControl>
            </Box>
          </Item>
        </Grid>
        <Grid xs={12} md={9}>
          <Item>
            <Title>
              Results <StyledListAltIcon />
            </Title>
            <Box>
              {resultsVisible.length == 0 && (
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  Unfortunately there are <strong>no results!</strong>
                </Alert>
              )}
              {resultsVisible &&
                resultsVisible?.map((item, index) => (
                  <SearchItem
                    key={index}
                    image={item.artworkUrl60}
                    artistName={item.artistName}
                    trackName={item.trackName}
                  />
                ))}
              {resultsVisible.length == results.length &&
                results.length > 0 && <h2>No more items to load</h2>}
              <div ref={loader} style={{ height: 50 }} />
            </Box>
          </Item>
        </Grid>
        <Grid xs={12} md={8}>
          <Item>
            <Typography variant="h6" component="h1">
              Next Front-End Technical Test - Jan Sargsyan
            </Typography>
          </Item>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
