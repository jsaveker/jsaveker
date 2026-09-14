#!/usr/bin/env python3
"""Capture the real RFTUI with its synthetic demo generator; never open a radio."""
import argparse
import asyncio
from datetime import UTC, datetime, timedelta
import os
from pathlib import Path
import subprocess
import sys
from types import SimpleNamespace
from unittest.mock import patch

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--source', required=True, type=Path)
parser.add_argument('--frames', required=True, type=Path)
args = parser.parse_args()
expected = 'b3c5d11015d978db4f2f0427c7fb2a4863db68b7'
revision = subprocess.check_output(['git','-C',str(args.source),'rev-parse','HEAD'],text=True).strip()
if revision != expected:
    raise SystemExit(f'Review a new capture source first: expected {expected}, found {revision}')
if subprocess.check_output(['git','-C',str(args.source),'status','--porcelain','--','src/rftui'],text=True).strip():
    raise SystemExit('Capture source contains uncommitted changes.')
os.environ.pop('NO_COLOR',None)
os.environ['TERM']='xterm-256color'
os.environ['COLORTERM']='truecolor'
sys.path.insert(0,str(args.source/'src'))
from rftui.app import RFTUIApp
from rftui.model import SweepConfig
from rftui.source import DemoSpectrumSource

class ScriptedDemoSource:
    def __init__(self,config):
        self.config=config
        self.generator=DemoSpectrumSource(config)
        self.running=False
        self.status='stopped'
        self.error=None
    def start(self,callback=None):
        self.callback=callback
        self.running=True
        self.status='running'
    def stop(self):
        self.running=False
        self.status='stopped'

async def main():
    args.frames.mkdir(parents=True,exist_ok=True)
    config=SweepConfig()
    source=ScriptedDemoSource(config)
    app=RFTUIApp(source,config,demo=True)
    clock=[1000.0]
    step=0
    with patch('rftui.app.time',SimpleNamespace(monotonic=lambda:clock[0])):
        async with app.run_test(size=(144,44)) as pilot:
            await pilot.pause()
            for index in range(48):
                for _ in range(3 if index else 96):
                    clock[0]=1000+step*source.generator.interval_s
                    frame=source.generator.next_frame(timestamp=datetime(2026,9,14,12,tzinfo=UTC)+timedelta(seconds=step*.12))
                    app._receive_frame(frame)
                    app._drain_pending_frame()
                    step+=1
                await pilot.pause()
                svg=args.frames/f'{index:03}.svg'
                svg.write_text(app.export_screenshot())
                subprocess.run(['rsvg-convert','--width','1100',str(svg),'-o',str(args.frames/f'{index:03}.png')],check=True)
                if index%12==0:
                    print(f'Captured frame {index}/48',flush=True)
    print(f'Captured 48 frames from {revision}',flush=True)

asyncio.run(main())
