"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Employee } from "@/lib/types";
import { Avatar, EmptyState, PageHeader } from "@/components/ui";

interface TreeNode {
  employee: Employee;
  children: TreeNode[];
}

function buildTree(employees: Employee[]): TreeNode[] {
  const active = employees.filter((e) => e.status !== "ausgeschieden");
  const byName = new Map<string, Employee>();
  active.forEach((e) => byName.set(`${e.first_name} ${e.last_name}`, e));

  const nodes = new Map<string, TreeNode>();
  active.forEach((e) => nodes.set(e.id, { employee: e, children: [] }));

  const roots: TreeNode[] = [];
  active.forEach((e) => {
    const node = nodes.get(e.id)!;
    const manager = e.manager ? byName.get(e.manager.trim()) : undefined;
    if (manager && manager.id !== e.id) {
      nodes.get(manager.id)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

function PersonCard({ employee }: { employee: Employee }) {
  return (
    <Link
      href={`/mitarbeiter/${employee.id}`}
      className="card inline-flex items-center gap-3 px-4 py-2.5 transition hover:shadow-cardHover"
    >
      <Avatar name={`${employee.first_name} ${employee.last_name}`} size="sm" />
      <span className="text-left">
        <span className="block text-sm font-bold text-petrol-900">
          {employee.first_name} {employee.last_name}
        </span>
        <span className="block text-xs text-petrol-400">{employee.position}</span>
      </span>
    </Link>
  );
}

function Branch({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  return (
    <div className={depth === 0 ? "" : "relative pl-8"}>
      {depth > 0 && (
        <>
          <span className="absolute left-3 top-0 h-full w-px bg-petrol-200" />
          <span className="absolute left-3 top-6 h-px w-5 bg-petrol-200" />
        </>
      )}
      <div className="py-1.5">
        <PersonCard employee={node.employee} />
      </div>
      {node.children
        .sort((a, b) => a.employee.last_name.localeCompare(b.employee.last_name))
        .map((child) => (
          <Branch key={child.employee.id} node={child} depth={depth + 1} />
        ))}
    </div>
  );
}

export default function OrgChartPage() {
  const supabase = createClient();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("employees")
      .select("*")
      .then(({ data }) => {
        setEmployees((data as Employee[]) ?? []);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <p className="py-20 text-center text-petrol-400">Lade Organigramm…</p>;
  }

  const roots = buildTree(employees);

  return (
    <div>
      <PageHeader
        title="Organigramm"
        subtitle="Hierarchie auf Basis des Felds „Vorgesetzte:r“ in der Personalakte."
      />

      {roots.length === 0 ? (
        <EmptyState
          title="Keine aktiven Mitarbeiter:innen"
          hint="Lege Mitarbeiter an und pflege das Feld „Vorgesetzte:r“."
        />
      ) : (
        <div className="card space-y-4 p-6">
          {roots.map((root) => (
            <Branch key={root.employee.id} node={root} />
          ))}
        </div>
      )}
    </div>
  );
}
