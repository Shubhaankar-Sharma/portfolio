"use client";

import React, { useState, useEffect, useRef } from 'react';

const GreenContextSimulation = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [eventStates, setEventStates] = useState({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const OPERATORS = 5;
  const PIPELINE_LENGTH = 700;

  const nGCTimes = [5, 8, 35, 6, 7];
  const pGCTimes = [22, 21, 22, 23, 22];
  const operatorNames = ['Source', 'Middle0', 'Middle1', 'Middle2', 'Sink'];

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const reset = () => {
    setTime(0);
    setEventStates({});
    setIsRunning(false);
  };

  const Pipeline = ({ title, processingTimes, isGreenContext = false, pipelineId }: any) => {
    const stageWidth = PIPELINE_LENGTH / OPERATORS;
    const eventInterval = 25;

    const pipelineKey = `${pipelineId}`;
    if (!eventStates[pipelineKey as keyof typeof eventStates]) {
      (eventStates as any)[pipelineKey] = {};
    }

    const events = [];
    const droppedEvents = [];

    const maxEventId = Math.floor(time / eventInterval);

    for (let eventId = 0; eventId <= maxEventId; eventId++) {
      const arrivalTime = eventId * eventInterval;
      if (arrivalTime > time) continue;

      const pipelineEvents = (eventStates as any)[pipelineKey];

      if (!pipelineEvents[eventId]) {
        pipelineEvents[eventId] = {
          id: eventId,
          arrivalTime,
          currentStage: 0,
          stageStartTime: arrivalTime,
          status: 'waiting',
          position: 0,
          dropped: false
        };
      }

      const event = pipelineEvents[eventId];

      if (!event.dropped && event.status !== 'complete') {
        if (event.status === 'waiting' || event.status === 'processing') {
          const stageDuration = processingTimes[event.currentStage];
          const stageEndTime = event.stageStartTime + stageDuration;

          if (time >= event.stageStartTime && time < stageEndTime) {
            event.status = 'processing';
            const progress = (time - event.stageStartTime) / stageDuration;
            event.position = event.currentStage * stageWidth + (progress * stageWidth);
          } else if (time >= stageEndTime) {
            if (event.currentStage === OPERATORS - 1) {
              event.status = 'complete';
              event.position = PIPELINE_LENGTH;
            } else {
              const nextStage = event.currentStage + 1;

              let nextStageBlocked = false;

              for (let otherId = 0; otherId < eventId; otherId++) {
                if (pipelineEvents[otherId]) {
                  const otherEvent = pipelineEvents[otherId];
                  if (otherEvent.currentStage === nextStage &&
                      (otherEvent.status === 'processing' || otherEvent.status === 'queued')) {
                    nextStageBlocked = true;
                    break;
                  }
                }
              }

              if (nextStageBlocked) {
                let queuedAtNextStage = 0;
                for (let otherId = 0; otherId < eventId; otherId++) {
                  if (pipelineEvents[otherId]) {
                    const otherEvent = pipelineEvents[otherId];
                    if (otherEvent.currentStage === nextStage && otherEvent.status === 'queued') {
                      queuedAtNextStage++;
                    }
                  }
                }

                if (queuedAtNextStage >= 1) {
                  event.dropped = true;
                  event.status = 'dropped';
                } else {
                  event.status = 'queued';
                  event.currentStage = nextStage;
                  event.position = nextStage * stageWidth + 10;
                }
              } else {
                event.currentStage = nextStage;
                event.stageStartTime = time;
                event.status = 'processing';
                event.position = nextStage * stageWidth;
              }
            }
          }
        } else if (event.status === 'queued') {
          const currentStage = event.currentStage;
          let stageAvailable = true;

          for (let otherId = 0; otherId < eventId; otherId++) {
            if (pipelineEvents[otherId]) {
              const otherEvent = pipelineEvents[otherId];
              if (otherEvent.currentStage === currentStage && otherEvent.status === 'processing') {
                stageAvailable = false;
                break;
              }
            }
          }

          if (stageAvailable) {
            event.status = 'processing';
            event.stageStartTime = time;
          }
        }
      }

      if (event.dropped) {
        droppedEvents.push(event);
      } else {
        events.push(event);
      }
    }

    const stageStats = processingTimes.map((procTime: number, stageIdx: number) => {
      const eventsProcessing = events.filter(e =>
        e.currentStage === stageIdx && e.status === 'processing'
      ).length;

      const eventsQueued = events.filter(e =>
        e.currentStage === stageIdx && e.status === 'queued'
      ).length;

      const isBottleneck = procTime === Math.max(...processingTimes);

      return {
        x: stageIdx * stageWidth,
        width: stageWidth,
        procTime,
        eventsProcessing,
        eventsQueued,
        isBottleneck
      };
    });

    const totalDropped = droppedEvents.length;
    const totalProcessed = events.filter(e => e.status === 'complete').length;
    const totalActive = events.filter(e => e.status !== 'complete').length;

    return (
      <div style={{ marginBottom: '32px', padding: '20px', backgroundColor: 'var(--wash1)', borderRadius: '8px', border: '1px solid var(--transparentBorder)' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '500', marginBottom: '16px', textAlign: 'center', color: 'var(--grey1)' }}>{title}</h3>

        <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'var(--wash1)', border: '1px solid var(--transparentBorder)', borderRadius: '6px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: '500', color: 'var(--grey2)', marginBottom: '0.5rem' }}>Dropped Events</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {droppedEvents.length === 0 ? (
              <span style={{ color: 'var(--grey3)', fontSize: '13px' }}>None</span>
            ) : (
              droppedEvents.map((event: any) => (
                <div key={`dropped-${event.id}`} style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  backgroundColor: 'var(--grey1)',
                  color: 'var(--background)',
                  fontSize: '10px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '500'
                }}>
                  E{event.id}
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ position: 'relative', height: '8rem', backgroundColor: 'var(--background)', borderRadius: '6px', border: '1px solid var(--transparentBorder)', marginBottom: '16px' }}>
          <svg width="100%" height="100%" viewBox={`0 0 ${PIPELINE_LENGTH} 128`}>
            {stageStats.map((stage: any, i: number) => (
              <g key={`stage-${i}`}>
                <rect
                  x={stage.x}
                  y={25}
                  width={stage.width}
                  height={60}
                  fill={stage.isBottleneck ? '#fee2e2' : '#f9fafb'}
                  stroke={stage.isBottleneck ? '#dc2626' : '#d1d5db'}
                  strokeWidth="2"
                  rx="4"
                />

                <text
                  x={stage.x + stage.width / 2}
                  y={45}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="#374151"
                >
                  {operatorNames[i]}
                </text>

                <text
                  x={stage.x + stage.width / 2}
                  y={60}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#6b7280"
                >
                  {stage.procTime}ms
                </text>

                <text
                  x={stage.x + stage.width / 2}
                  y={75}
                  textAnchor="middle"
                  fontSize="9"
                  fill={stage.isBottleneck ? '#dc2626' : '#6b7280'}
                  fontWeight={stage.isBottleneck ? 'bold' : 'normal'}
                >
                  {stage.isBottleneck ? 'BOTTLENECK' : `P:${stage.eventsProcessing} Q:${stage.eventsQueued}`}
                </text>
              </g>
            ))}

            {events.filter(e => e.status !== 'complete').map((event: any) => {
              const isProcessing = event.status === 'processing';
              const isQueued = event.status === 'queued';

              let displayX = event.position;
              let displayY = isQueued ? 15 : 100;

              return (
                <g key={`event-${event.id}`}>
                  <circle
                    cx={displayX}
                    cy={displayY}
                    r={isProcessing ? "6" : "4"}
                    fill={
                      isQueued ? '#fbbf24' :
                      isProcessing ? (isGreenContext ? '#059669' : '#3b82f6') :
                      '#10b981'
                    }
                    stroke={isProcessing ? '#ffffff' : isQueued ? '#f59e0b' : 'none'}
                    strokeWidth={isProcessing || isQueued ? "2" : "0"}
                  />

                  <text
                    x={displayX}
                    y={displayY + (isQueued ? -8 : 15)}
                    textAnchor="middle"
                    fontSize="8"
                    fill="#374151"
                    fontWeight="bold"
                  >
                    E{event.id}
                  </text>
                </g>
              );
            })}

            {Array.from({length: OPERATORS - 1}).map((_, i) => (
              <polygon
                key={`arrow-${i}`}
                points={`${(i + 1) * stageWidth - 8},95 ${(i + 1) * stageWidth - 3},90 ${(i + 1) * stageWidth - 3},100`}
                fill="#6b7280"
                opacity="0.5"
              />
            ))}
          </svg>
        </div>

        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'var(--background)', borderRadius: '6px', border: '1px solid var(--transparentBorder)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '13px' }}>
            <div>
              <span style={{ fontWeight: '500', color: 'var(--grey2)' }}>Completed:</span> <span style={{ color: 'var(--grey1)' }}>{totalProcessed}</span>
            </div>
            <div>
              <span style={{ fontWeight: '500', color: 'var(--grey2)' }}>Active:</span> <span style={{ color: 'var(--grey1)' }}>{totalActive}</span>
            </div>
            <div>
              <span style={{ fontWeight: '500', color: 'var(--grey2)' }}>Dropped:</span> <span style={{ color: 'var(--grey1)' }}>{totalDropped}</span>
            </div>
            <div>
              <span style={{ fontWeight: '500', color: 'var(--grey2)' }}>Success Rate:</span> <span style={{ color: 'var(--grey1)' }}>{
                maxEventId >= 0 ?
                (100 - (totalDropped / (maxEventId + 1)) * 100).toFixed(1) + '%' :
                '100%'
              }</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ margin: '32px 0', padding: '24px', backgroundColor: 'var(--wash1)', borderRadius: '8px', border: '1px solid var(--transparentBorder)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', color: 'var(--grey3)' }}>
          {time}ms
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsRunning(!isRunning)}
            style={{
              padding: '6px 12px',
              backgroundColor: 'var(--grey1)',
              color: 'var(--background)',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            {isRunning ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={reset}
            style={{
              padding: '6px 12px',
              backgroundColor: 'var(--wash2)',
              color: 'var(--grey2)',
              borderRadius: '6px',
              border: '1px solid var(--transparentBorder)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <Pipeline
        title="Default Policy"
        processingTimes={nGCTimes}
        isGreenContext={false}
        pipelineId="nGC"
      />

      <Pipeline
        title="Green Context Policy"
        processingTimes={pGCTimes}
        isGreenContext={true}
        pipelineId="pGC"
      />
    </div>
  );
};

export default GreenContextSimulation;
