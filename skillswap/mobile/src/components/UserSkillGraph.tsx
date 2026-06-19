import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import Svg, { Line, Circle, Rect, Text as SvgText, G } from 'react-native-svg';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/theme';
import type { UserGraphNode, UserGraphEdge, UserGraphResponse } from '@/types';

interface UserSkillGraphProps {
  graph: UserGraphResponse | null;
  loading?: boolean;
  error?: string | null;
}

export function UserSkillGraph({ graph, loading = false, error = null }: UserSkillGraphProps) {
  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.stateText}>Loading profile graph...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={[styles.stateText, styles.errorText]}>{error}</Text>
      </View>
    );
  }

  if (!graph || graph.nodes.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.stateText}>No graph data available</Text>
      </View>
    );
  }

  const { nodes, edges, isFallback } = graph;

  // Find center user node
  const userNode = nodes.find((n) => n.group === 'user');
  if (!userNode) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.stateText}>No user found in graph</Text>
      </View>
    );
  }

  // Separate node types
  const teachNodes = nodes.filter((n) => n.group === 'teach');
  const learnNodes = nodes.filter((n) => n.group === 'learn');
  const postNodes = nodes.filter((n) => n.group === 'post');

  // Node Capping Limits
  const TEACH_CAP = 3;
  const LEARN_CAP = 3;
  const POST_CAP = 2;

  // Process visible nodes with capping
  const visibleTeachNodes: UserGraphNode[] = [];
  if (teachNodes.length <= TEACH_CAP) {
    visibleTeachNodes.push(...teachNodes);
  } else {
    visibleTeachNodes.push(...teachNodes.slice(0, TEACH_CAP - 1));
    visibleTeachNodes.push({
      id: 'teach_more',
      label: `+${teachNodes.length - (TEACH_CAP - 1)} more`,
      type: 'skill',
      group: 'teach',
    });
  }

  const visibleLearnNodes: UserGraphNode[] = [];
  if (learnNodes.length <= LEARN_CAP) {
    visibleLearnNodes.push(...learnNodes);
  } else {
    visibleLearnNodes.push(...learnNodes.slice(0, LEARN_CAP - 1));
    visibleLearnNodes.push({
      id: 'learn_more',
      label: `+${learnNodes.length - (LEARN_CAP - 1)} more`,
      type: 'skill',
      group: 'learn',
    });
  }

  const visiblePostNodes: UserGraphNode[] = [];
  if (postNodes.length <= POST_CAP) {
    visiblePostNodes.push(...postNodes);
  } else {
    visiblePostNodes.push(...postNodes.slice(0, POST_CAP - 1));
    visiblePostNodes.push({
      id: 'post_more',
      label: `+${postNodes.length - (POST_CAP - 1)} more`,
      type: 'post',
      group: 'post',
    });
  }

  // Dimensions
  const width = 320;
  const height = 280;

  // Coordinates
  const userX = width / 2;
  const userY = 110;

  const coords: Record<string, { x: number; y: number }> = {};
  coords[userNode.id] = { x: userX, y: userY };

  // Set teach coordinates (Left, x = 65)
  visibleTeachNodes.forEach((node, index) => {
    let y = userY;
    if (visibleTeachNodes.length === 2) {
      y = index === 0 ? 75 : 145;
    } else if (visibleTeachNodes.length === 3) {
      y = index === 0 ? 55 : index === 1 ? 110 : 165;
    }
    coords[node.id] = { x: 65, y };
  });

  // Set learn coordinates (Right, x = 255)
  visibleLearnNodes.forEach((node, index) => {
    let y = userY;
    if (visibleLearnNodes.length === 2) {
      y = index === 0 ? 75 : 145;
    } else if (visibleLearnNodes.length === 3) {
      y = index === 0 ? 55 : index === 1 ? 110 : 165;
    }
    coords[node.id] = { x: 255, y };
  });

  // Set post coordinates (Bottom, y = 220)
  visiblePostNodes.forEach((node, index) => {
    let x = userX;
    if (visiblePostNodes.length === 2) {
      x = index === 0 ? 95 : 225;
    }
    coords[node.id] = { x, y: 220 };
  });

  // Reconstruct visible edges list
  const visibleNodeIds = new Set(Object.keys(coords));
  const visibleEdges = edges.filter(
    (e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
  );

  // In fallback mode, connect capped nodes directly if edges aren't fully matching
  const hasUserEdge = (targetId: string) => visibleEdges.some(e => e.target === targetId);
  
  // Make sure we have edges to all visible child nodes
  const displayEdges = [...visibleEdges];
  Object.keys(coords).forEach(nodeId => {
    if (nodeId !== userNode.id && !hasUserEdge(nodeId)) {
      let relLabel: 'CAN_TEACH' | 'WANTS_TO_LEARN' | 'CREATED' = 'CAN_TEACH';
      const node = visibleTeachNodes.find(n => n.id === nodeId) ||
                   visibleLearnNodes.find(n => n.id === nodeId) ||
                   visiblePostNodes.find(n => n.id === nodeId);
      
      if (node) {
        if (node.group === 'learn') relLabel = 'WANTS_TO_LEARN';
        else if (node.group === 'post') relLabel = 'CREATED';
        
        displayEdges.push({
          source: userNode.id,
          target: nodeId,
          label: relLabel
        });
      }
    }
  });

  // Helper to truncate text beautifully
  const getTruncatedLabel = (label: string, group: string) => {
    if (group === 'post') {
      return label.length > 15 ? label.substring(0, 13) + '..' : label;
    }
    return label.length > 12 ? label.substring(0, 10) + '..' : label;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.graphTitle}>Personal Knowledge Graph</Text>
      
      {isFallback && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>⚠️ Offline Fallback Data</Text>
        </View>
      )}

      <View style={styles.svgWrapper}>
        <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Draw connecting edges */}
          {displayEdges.map((edge, index) => {
            const start = coords[edge.source];
            const end = coords[edge.target];
            if (!start || !end) return null;

            let strokeColor = Colors.border;
            if (edge.label === 'CAN_TEACH') {
              strokeColor = Colors.primaryLight + '50';
            } else if (edge.label === 'WANTS_TO_LEARN') {
              strokeColor = Colors.error + '40';
            } else if (edge.label === 'CREATED') {
              strokeColor = Colors.textTertiary + '50';
            }

            return (
              <Line
                key={`edge_${edge.source}_${edge.target}_${index}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={strokeColor}
                strokeWidth={2}
                strokeDasharray={edge.label === 'CREATED' ? '4 4' : undefined}
              />
            );
          })}

          {/* Render Nodes */}
          {Object.entries(coords).map(([nodeId, pt]) => {
            // Find full node details
            const node = nodes.find((n) => n.id === nodeId) ||
                         visibleTeachNodes.find(n => n.id === nodeId) ||
                         visibleLearnNodes.find(n => n.id === nodeId) ||
                         visiblePostNodes.find(n => n.id === nodeId);
            
            if (!node) return null;

            if (node.group === 'user') {
              return (
                <G key={nodeId}>
                  <Circle
                    cx={pt.x}
                    cy={pt.y}
                    r={22}
                    fill={Colors.primary}
                    stroke={Colors.primaryLight}
                    strokeWidth={2}
                  />
                  <SvgText
                    x={pt.x}
                    y={pt.y}
                    fill={Colors.textInverse}
                    fontSize={11}
                    fontWeight="bold"
                    textAnchor="middle"
                    dy="3"
                  >
                    {node.label.charAt(0).toUpperCase()}
                  </SvgText>
                </G>
              );
            }

            // Skills & Posts as pill buttons
            const isPost = node.group === 'post';
            const pillW = isPost ? 100 : 76;
            const pillH = 22;
            const rx = isPost ? 6 : 11;

            let fill: string = Colors.surfaceSecondary;
            let stroke: string = Colors.border;
            let textFill: string = Colors.textSecondary;

            if (node.group === 'teach') {
              fill = Colors.teachBg;
              stroke = Colors.primaryLight + '80';
              textFill = Colors.teachText;
            } else if (node.group === 'learn') {
              fill = Colors.learnBg;
              stroke = Colors.error + '40';
              textFill = Colors.learnText;
            } else if (node.group === 'post') {
              fill = Colors.background;
              stroke = Colors.border;
              textFill = Colors.textSecondary;
            }

            if (nodeId.endsWith('_more')) {
              fill = Colors.surface;
              stroke = Colors.border;
              textFill = Colors.textTertiary;
            }

            return (
              <G key={nodeId}>
                <Rect
                  x={pt.x - pillW / 2}
                  y={pt.y - pillH / 2}
                  width={pillW}
                  height={pillH}
                  rx={rx}
                  ry={rx}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={1}
                />
                <SvgText
                  x={pt.x}
                  y={pt.y}
                  fill={textFill}
                  fontSize={8.5}
                  fontWeight="bold"
                  textAnchor="middle"
                  dy="3"
                >
                  {getTruncatedLabel(node.label, node.group)}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.teachBg, borderColor: Colors.primaryLight }]} />
          <Text style={styles.legendLabel}>Teaches</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.learnBg, borderColor: Colors.error }]} />
          <Text style={styles.legendLabel}>Wants to Learn</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.surfaceSecondary, borderColor: Colors.textTertiary }]} />
          <Text style={styles.legendLabel}>Posts</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    height: 340,
    justifyContent: 'space-between',
    ...Shadow.sm,
  },
  svgWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  stateText: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    marginTop: Spacing.sm,
  },
  errorText: {
    color: Colors.error,
  },
  offlineBanner: {
    backgroundColor: Colors.warningBg,
    borderColor: Colors.warning + '30',
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingVertical: 3,
    paddingHorizontal: Spacing.md,
    alignSelf: 'center',
    marginBottom: Spacing.xs,
  },
  offlineText: {
    fontSize: 9,
    color: Colors.warning,
    fontWeight: FontWeight.bold,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  legendLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
});
