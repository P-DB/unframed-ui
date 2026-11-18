#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadData } from './data.js';
import { createServer } from './server.js';

// stdout carries the protocol: never console.log here, use console.error.
await createServer(loadData()).connect(new StdioServerTransport());
