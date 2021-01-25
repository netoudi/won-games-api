/*
 *
 * HomePage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import { Table } from '@buffetjs/core';
import { Header } from '@buffetjs/custom';
import axios from 'axios';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 18px 30px;

  p {
    margin-top: 1rem;
  }
`;

const HomePage = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios.
      get('https://api.github.com/users/react-avancado/repos').
      then((response) => setRows(response.data)).
      catch((e) => strapi.notification.error(`Ops...github API error, ${e}`));
  }, []);

  const headers = [
    {
      name: 'Name',
      value: 'name',
    },
    {
      name: 'Description',
      value: 'description',
    },
    {
      name: 'Url',
      value: 'html_url',
    },
  ];

  return (
    <Wrapper>
      <Header
        title={{ label: 'React Avançado Repositories' }}
        content="A list of our repositories in React Avançado course."
      />
      <Table
        headers={headers}
        rows={rows}
      />
    </Wrapper>
  );
};

export default memo(HomePage);