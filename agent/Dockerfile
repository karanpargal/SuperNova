FROM langchain/langgraphjs-api:20



ADD . /deps/react-agent-js

RUN cd /deps/react-agent-js && yarn install --frozen-lockfile

ENV LANGSERVE_GRAPHS='{"agent": "./src/react_agent/graph.ts:graph"}'

WORKDIR /deps/react-agent-js

RUN (test ! -f /api/langgraph_api/js/build.mts && echo "Prebuild script not found, skipping") || tsx /api/langgraph_api/js/build.mts