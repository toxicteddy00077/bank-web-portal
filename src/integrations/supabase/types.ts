export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      account: {
        Row: {
          accountno: number
          balance: number
          branchid: number | null
          userid: number | null
        }
        Insert: {
          accountno?: number
          balance: number
          branchid?: number | null
          userid?: number | null
        }
        Update: {
          accountno?: number
          balance?: number
          branchid?: number | null
          userid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "account_branchid_fkey"
            columns: ["branchid"]
            isOneToOne: false
            referencedRelation: "branch"
            referencedColumns: ["branchid"]
          },
          {
            foreignKeyName: "account_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["userid"]
          },
        ]
      }
      bank: {
        Row: {
          bankid: number
          bankmoney: number
          bankname: string
          noofbranches: number
        }
        Insert: {
          bankid?: number
          bankmoney: number
          bankname: string
          noofbranches: number
        }
        Update: {
          bankid?: number
          bankmoney?: number
          bankname?: string
          noofbranches?: number
        }
        Relationships: []
      }
      branch: {
        Row: {
          bankid: number | null
          branchadd: string
          branchid: number
        }
        Insert: {
          bankid?: number | null
          branchadd: string
          branchid?: number
        }
        Update: {
          bankid?: number | null
          branchadd?: string
          branchid?: number
        }
        Relationships: [
          {
            foreignKeyName: "branch_bankid_fkey"
            columns: ["bankid"]
            isOneToOne: false
            referencedRelation: "bank"
            referencedColumns: ["bankid"]
          },
        ]
      }
      employee: {
        Row: {
          branchid: number | null
          employeeid: number
          name: string
        }
        Insert: {
          branchid?: number | null
          employeeid?: number
          name: string
        }
        Update: {
          branchid?: number | null
          employeeid?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_branchid_fkey"
            columns: ["branchid"]
            isOneToOne: false
            referencedRelation: "branch"
            referencedColumns: ["branchid"]
          },
        ]
      }
      loan: {
        Row: {
          bankid: number | null
          duration: number
          interest: number
          issuedate: string
          loanamount: number
          loanid: number
          loantype: string
          userid: number | null
        }
        Insert: {
          bankid?: number | null
          duration: number
          interest: number
          issuedate: string
          loanamount: number
          loanid?: number
          loantype: string
          userid?: number | null
        }
        Update: {
          bankid?: number | null
          duration?: number
          interest?: number
          issuedate?: string
          loanamount?: number
          loanid?: number
          loantype?: string
          userid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_bankid_fkey"
            columns: ["bankid"]
            isOneToOne: false
            referencedRelation: "bank"
            referencedColumns: ["bankid"]
          },
          {
            foreignKeyName: "loan_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["userid"]
          },
        ]
      }
      transaction_history: {
        Row: {
          accountno1: number | null
          accountno2: number | null
          branchid: number | null
          transactionamount: number
          transactionid: number
          transactiontime: string
        }
        Insert: {
          accountno1?: number | null
          accountno2?: number | null
          branchid?: number | null
          transactionamount: number
          transactionid?: number
          transactiontime: string
        }
        Update: {
          accountno1?: number | null
          accountno2?: number | null
          branchid?: number | null
          transactionamount?: number
          transactionid?: number
          transactiontime?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_history_accountno1_fkey"
            columns: ["accountno1"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["accountno"]
          },
          {
            foreignKeyName: "transaction_history_accountno2_fkey"
            columns: ["accountno2"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["accountno"]
          },
          {
            foreignKeyName: "transaction_history_branchid_fkey"
            columns: ["branchid"]
            isOneToOne: false
            referencedRelation: "branch"
            referencedColumns: ["branchid"]
          },
        ]
      }
      users: {
        Row: {
          address: string
          mobilenumber: string
          name: string
          userid: number
        }
        Insert: {
          address: string
          mobilenumber: string
          name: string
          userid?: number
        }
        Update: {
          address?: string
          mobilenumber?: string
          name?: string
          userid?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
