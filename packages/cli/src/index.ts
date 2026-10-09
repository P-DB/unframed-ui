#!/usr/bin/env node
import { run } from './cli.js';
import { processIo } from './lib/io.js';

process.exitCode = await run(process.argv.slice(2), processIo());
